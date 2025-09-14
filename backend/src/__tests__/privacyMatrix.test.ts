import request from "supertest";
import app from "../app";
import { supabaseAdmin } from "../services/supabase";

describe("Privacy Matrix Endpoints", () => {
  let userToken: string;
  let userId: string;
  let contextId: string;
  let attributeId: string;

  const testUser = {
    email: "privacy-test@example.com",
    password: "testpassword123",
    confirmPassword: "testpassword123",
  };

  beforeEach(async () => {
    // Create test user
    const signupResponse = await request(app)
      .post("/api/auth/signup")
      .send(testUser);

    userToken = signupResponse.body.data.token;
    userId = signupResponse.body.data.user.id;

    // Create test context
    const { data: contextData } = await supabaseAdmin
      .from("contexts")
      .insert({
        user_id: userId,
        name: "Work",
        description: "Professional",
        color: "#6366f1",
      })
      .select()
      .single();

    contextId = contextData.id;

    // Create test attribute
    const { data: attributeData } = await supabaseAdmin
      .from("attributes")
      .insert({
        user_id: userId,
        name: "Email",
        value: "test@work.com",
        type: "email",
      })
      .select()
      .single();

    attributeId = attributeData.id;
  });

  afterEach(async () => {
    // Clean up test data
    await supabaseAdmin
      .from("context_attributes")
      .delete()
      .eq("user_id", userId);

    await supabaseAdmin.from("attributes").delete().eq("user_id", userId);

    await supabaseAdmin.from("contexts").delete().eq("user_id", userId);

    await supabaseAdmin.from("users").delete().eq("email", testUser.email);
  });

  describe("GET /api/privacy-matrix", () => {
    beforeEach(async () => {
      // Create context-attribute relationship
      await supabaseAdmin.from("context_attributes").insert({
        user_id: userId,
        context_id: contextId,
        attribute_id: attributeId,
      });
    });

    it("should return privacy matrix for authenticated user", async () => {
      const response = await request(app)
        .get("/api/privacy-matrix")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.matrix).toBeDefined();
      expect(response.body.data.matrix.length).toBeGreaterThan(0);

      const matrixRow = response.body.data.matrix[0];
      expect(matrixRow.attribute).toBeDefined();
      expect(matrixRow.contexts).toBeDefined();
      expect(matrixRow.contexts[contextId]).toBe(true);
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .get("/api/privacy-matrix")
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should only return data for authenticated user", async () => {
      // Create another user with their own data
      const otherUser = {
        email: "other@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const otherSignup = await request(app)
        .post("/api/auth/signup")
        .send(otherUser);

      const otherUserId = otherSignup.body.data.user.id;

      // Create context and attribute for other user
      const { data: otherContext } = await supabaseAdmin
        .from("contexts")
        .insert({
          user_id: otherUserId,
          name: "Other Context",
          description: "Other user context",
          color: "#ef4444",
        })
        .select()
        .single();

      const { data: otherAttribute } = await supabaseAdmin
        .from("attributes")
        .insert({
          user_id: otherUserId,
          name: "Other Email",
          value: "other@test.com",
          type: "email",
        })
        .select()
        .single();

      const response = await request(app)
        .get("/api/privacy-matrix")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      // Should only see own data
      expect(response.body.data.matrix.length).toBe(1);
      expect(response.body.data.matrix[0].attribute.user_id).toBe(userId);

      // Cleanup
      await supabaseAdmin.from("users").delete().eq("email", otherUser.email);
    });
  });

  describe("POST /api/context-attributes", () => {
    it("should assign attribute to context successfully", async () => {
      const assignmentData = {
        context_id: contextId,
        attribute_id: attributeId,
      };

      const response = await request(app)
        .post("/api/context-attributes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(assignmentData)
        .expect(201);

      expect(response.body.success).toBe(true);

      // Verify assignment in database
      const { data } = await supabaseAdmin
        .from("context_attributes")
        .select()
        .eq("user_id", userId)
        .eq("context_id", contextId)
        .eq("attribute_id", attributeId);

      expect(data).toHaveLength(1);
    });

    it("should prevent duplicate assignments", async () => {
      // Create initial assignment
      await supabaseAdmin.from("context_attributes").insert({
        user_id: userId,
        context_id: contextId,
        attribute_id: attributeId,
      });

      const assignmentData = {
        context_id: contextId,
        attribute_id: attributeId,
      };

      const response = await request(app)
        .post("/api/context-attributes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(assignmentData)
        .expect(409);

      expect(response.body.success).toBe(false);
    });

    it("should prevent assigning other users attributes", async () => {
      // Create another user and their attribute
      const otherUser = {
        email: "other@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const otherSignup = await request(app)
        .post("/api/auth/signup")
        .send(otherUser);

      const otherUserId = otherSignup.body.data.user.id;

      const { data: otherAttribute } = await supabaseAdmin
        .from("attributes")
        .insert({
          user_id: otherUserId,
          name: "Other Email",
          value: "other@test.com",
          type: "email",
        })
        .select()
        .single();

      const assignmentData = {
        context_id: contextId,
        attribute_id: otherAttribute.id,
      };

      const response = await request(app)
        .post("/api/context-attributes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(assignmentData)
        .expect(404);

      expect(response.body.success).toBe(false);

      // Cleanup
      await supabaseAdmin.from("users").delete().eq("email", otherUser.email);
    });
  });

  describe("DELETE /api/context-attributes/:contextId/:attributeId", () => {
    beforeEach(async () => {
      // Create context-attribute relationship
      await supabaseAdmin.from("context_attributes").insert({
        user_id: userId,
        context_id: contextId,
        attribute_id: attributeId,
      });
    });

    it("should remove attribute from context successfully", async () => {
      const response = await request(app)
        .delete(`/api/context-attributes/${contextId}/${attributeId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify removal in database
      const { data } = await supabaseAdmin
        .from("context_attributes")
        .select()
        .eq("user_id", userId)
        .eq("context_id", contextId)
        .eq("attribute_id", attributeId);

      expect(data).toHaveLength(0);
    });

    it("should prevent removing other users assignments", async () => {
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
        .delete(`/api/context-attributes/${contextId}/${attributeId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);

      // Verify assignment still exists
      const { data } = await supabaseAdmin
        .from("context_attributes")
        .select()
        .eq("user_id", userId)
        .eq("context_id", contextId)
        .eq("attribute_id", attributeId);

      expect(data).toHaveLength(1);

      // Cleanup
      await supabaseAdmin.from("users").delete().eq("email", otherUser.email);
    });
  });

  describe("Context-based attribute filtering", () => {
    let publicContextId: string;
    let workContextId: string;
    let emailAttributeId: string;
    let phoneAttributeId: string;

    beforeEach(async () => {
      // Create multiple contexts
      const { data: publicContext } = await supabaseAdmin
        .from("contexts")
        .insert({
          user_id: userId,
          name: "Public",
          description: "Public information",
          color: "#10b981",
        })
        .select()
        .single();

      publicContextId = publicContext.id;
      workContextId = contextId; // Already created in main beforeEach

      // Create multiple attributes
      const { data: emailAttribute } = await supabaseAdmin
        .from("attributes")
        .insert({
          user_id: userId,
          name: "Work Email",
          value: "work@company.com",
          type: "email",
        })
        .select()
        .single();

      const { data: phoneAttribute } = await supabaseAdmin
        .from("attributes")
        .insert({
          user_id: userId,
          name: "Phone",
          value: "+1-555-0123",
          type: "phone",
        })
        .select()
        .single();

      emailAttributeId = emailAttribute.id;
      phoneAttributeId = phoneAttribute.id;

      // Assign email to work context only
      await supabaseAdmin.from("context_attributes").insert({
        user_id: userId,
        context_id: workContextId,
        attribute_id: emailAttributeId,
      });

      // Assign phone to both contexts
      await supabaseAdmin.from("context_attributes").insert([
        {
          user_id: userId,
          context_id: workContextId,
          attribute_id: phoneAttributeId,
        },
        {
          user_id: userId,
          context_id: publicContextId,
          attribute_id: phoneAttributeId,
        },
      ]);
    });

    it("should correctly filter attributes based on context assignment", async () => {
      const response = await request(app)
        .get("/api/privacy-matrix")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      const matrix = response.body.data.matrix;

      // Find email attribute in matrix
      const emailRow = matrix.find(
        (row: any) => row.attribute.id === emailAttributeId
      );
      expect(emailRow).toBeDefined();
      expect(emailRow.contexts[workContextId]).toBe(true);
      expect(emailRow.contexts[publicContextId]).toBe(false);

      // Find phone attribute in matrix
      const phoneRow = matrix.find(
        (row: any) => row.attribute.id === phoneAttributeId
      );
      expect(phoneRow).toBeDefined();
      expect(phoneRow.contexts[workContextId]).toBe(true);
      expect(phoneRow.contexts[publicContextId]).toBe(true);
    });
  });
});
