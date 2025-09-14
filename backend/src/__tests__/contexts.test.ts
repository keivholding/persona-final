import request from "supertest";
import app from "../app";
import { supabaseAdmin } from "../services/supabase";

describe("Context Management Endpoints", () => {
  let userToken: string;
  let userId: string;

  const testUser = {
    email: "context-test@example.com",
    password: "testpassword123",
    confirmPassword: "testpassword123",
  };

  beforeEach(async () => {
    // Create test user and get token
    const signupResponse = await request(app)
      .post("/api/auth/signup")
      .send(testUser);

    userToken = signupResponse.body.data.token;
    userId = signupResponse.body.data.user.id;
  });

  afterEach(async () => {
    // Clean up test data
    await supabaseAdmin.from("contexts").delete().eq("user_id", userId);

    await supabaseAdmin.from("users").delete().eq("email", testUser.email);
  });

  describe("POST /api/contexts", () => {
    it("should create a new context successfully", async () => {
      const contextData = {
        name: "Work",
        description: "Professional contacts",
        color: "#6366f1",
      };

      const response = await request(app)
        .post("/api/contexts")
        .set("Authorization", `Bearer ${userToken}`)
        .send(contextData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.context.name).toBe(contextData.name);
      expect(response.body.data.context.description).toBe(
        contextData.description
      );
      expect(response.body.data.context.color).toBe(contextData.color);
      expect(response.body.data.context.user_id).toBe(userId);
    });

    it("should require authentication", async () => {
      const contextData = {
        name: "Work",
        description: "Professional contacts",
        color: "#6366f1",
      };

      const response = await request(app)
        .post("/api/contexts")
        .send(contextData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/contexts")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          description: "Missing name field",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should validate color format", async () => {
      const response = await request(app)
        .post("/api/contexts")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Work",
          description: "Professional contacts",
          color: "invalid-color",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/contexts", () => {
    beforeEach(async () => {
      // Create test contexts
      await supabaseAdmin.from("contexts").insert([
        {
          user_id: userId,
          name: "Work",
          description: "Professional",
          color: "#6366f1",
        },
        {
          user_id: userId,
          name: "Personal",
          description: "Friends and family",
          color: "#10b981",
        },
      ]);
    });

    it("should return user contexts", async () => {
      const response = await request(app)
        .get("/api/contexts")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contexts).toHaveLength(2);
      expect(response.body.data.contexts[0].user_id).toBe(userId);
      expect(response.body.data.contexts[1].user_id).toBe(userId);
    });

    it("should require authentication", async () => {
      const response = await request(app).get("/api/contexts").expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should only return contexts for authenticated user", async () => {
      // Create another user with contexts
      const otherUser = {
        email: "other@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const otherSignup = await request(app)
        .post("/api/auth/signup")
        .send(otherUser);

      const otherUserId = otherSignup.body.data.user.id;

      await supabaseAdmin.from("contexts").insert({
        user_id: otherUserId,
        name: "Other User Context",
        description: "Should not be visible",
        color: "#ef4444",
      });

      const response = await request(app)
        .get("/api/contexts")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.contexts).toHaveLength(2); // Only original user's contexts
      expect(
        response.body.data.contexts.every((ctx: any) => ctx.user_id === userId)
      ).toBe(true);

      // Cleanup
      await supabaseAdmin.from("users").delete().eq("email", otherUser.email);
    });
  });

  describe("PUT /api/contexts/:id", () => {
    let contextId: string;

    beforeEach(async () => {
      const { data } = await supabaseAdmin
        .from("contexts")
        .insert({
          user_id: userId,
          name: "Work",
          description: "Professional",
          color: "#6366f1",
        })
        .select()
        .single();

      contextId = data.id;
    });

    it("should update context successfully", async () => {
      const updateData = {
        name: "Updated Work",
        description: "Updated description",
      };

      const response = await request(app)
        .put(`/api/contexts/${contextId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.context.name).toBe(updateData.name);
      expect(response.body.data.context.description).toBe(
        updateData.description
      );
    });

    it("should prevent updating other users contexts", async () => {
      // Create another user
      const otherUser = {
        email: "other@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const otherSignup = await request(app)
        .post("/api/auth/signup")
        .send(otherUser);

      const otherToken = otherSignup.body.data.token;

      const response = await request(app)
        .put(`/api/contexts/${contextId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({
          name: "Malicious Update",
        })
        .expect(404);

      expect(response.body.success).toBe(false);

      // Cleanup
      await supabaseAdmin.from("users").delete().eq("email", otherUser.email);
    });
  });

  describe("DELETE /api/contexts/:id", () => {
    let contextId: string;

    beforeEach(async () => {
      const { data } = await supabaseAdmin
        .from("contexts")
        .insert({
          user_id: userId,
          name: "Work",
          description: "Professional",
          color: "#6366f1",
        })
        .select()
        .single();

      contextId = data.id;
    });

    it("should delete context successfully", async () => {
      const response = await request(app)
        .delete(`/api/contexts/${contextId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const { data } = await supabaseAdmin
        .from("contexts")
        .select()
        .eq("id", contextId);

      expect(data).toHaveLength(0);
    });

    it("should prevent deleting other users contexts", async () => {
      // Create another user
      const otherUser = {
        email: "other@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const otherSignup = await request(app)
        .post("/api/auth/signup")
        .send(otherUser);

      const otherToken = otherSignup.body.data.token;

      const response = await request(app)
        .delete(`/api/contexts/${contextId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);

      // Verify context still exists
      const { data } = await supabaseAdmin
        .from("contexts")
        .select()
        .eq("id", contextId);

      expect(data).toHaveLength(1);

      // Cleanup
      await supabaseAdmin.from("users").delete().eq("email", otherUser.email);
    });
  });
});
