import request from "supertest";
import app from "../app";
import { supabaseAdmin } from "../services/supabase";
import jwt from "jsonwebtoken";

describe("Security Tests", () => {
  let userToken: string;
  let userId: string;
  let otherUserToken: string;
  let otherUserId: string;

  const testUser = {
    email: "security-test@example.com",
    password: "testpassword123",
    confirmPassword: "testpassword123",
  };

  const otherUser = {
    email: "other-security-test@example.com",
    password: "otherpassword123",
    confirmPassword: "otherpassword123",
  };

  beforeEach(async () => {
    // Create first test user
    const signupResponse = await request(app)
      .post("/api/auth/signup")
      .send(testUser);

    userToken = signupResponse.body.data.token;
    userId = signupResponse.body.data.user.id;

    // Create second test user
    const otherSignupResponse = await request(app)
      .post("/api/auth/signup")
      .send(otherUser);

    otherUserToken = otherSignupResponse.body.data.token;
    otherUserId = otherSignupResponse.body.data.user.id;
  });

  afterEach(async () => {
    // Clean up test data
    await supabaseAdmin
      .from("context_attributes")
      .delete()
      .in("user_id", [userId, otherUserId]);

    await supabaseAdmin
      .from("attributes")
      .delete()
      .in("user_id", [userId, otherUserId]);

    await supabaseAdmin
      .from("contexts")
      .delete()
      .in("user_id", [userId, otherUserId]);

    await supabaseAdmin
      .from("users")
      .delete()
      .in("email", [testUser.email, otherUser.email]);
  });

  describe("Cross-user data access prevention", () => {
    let userContextId: string;
    let otherUserContextId: string;
    let userAttributeId: string;
    let otherUserAttributeId: string;

    beforeEach(async () => {
      // Create contexts for both users
      const { data: userContext } = await supabaseAdmin
        .from("contexts")
        .insert({
          user_id: userId,
          name: "User Work",
          description: "User professional context",
          color: "#6366f1",
        })
        .select()
        .single();

      userContextId = userContext.id;

      const { data: otherUserContext } = await supabaseAdmin
        .from("contexts")
        .insert({
          user_id: otherUserId,
          name: "Other User Work",
          description: "Other user professional context",
          color: "#ef4444",
        })
        .select()
        .single();

      otherUserContextId = otherUserContext.id;

      // Create attributes for both users
      const { data: userAttribute } = await supabaseAdmin
        .from("attributes")
        .insert({
          user_id: userId,
          name: "User Email",
          value: "user@test.com",
          type: "email",
        })
        .select()
        .single();

      userAttributeId = userAttribute.id;

      const { data: otherUserAttribute } = await supabaseAdmin
        .from("attributes")
        .insert({
          user_id: otherUserId,
          name: "Other User Email",
          value: "other@test.com",
          type: "email",
        })
        .select()
        .single();

      otherUserAttributeId = otherUserAttribute.id;
    });

    it("should prevent access to other users contexts", async () => {
      const response = await request(app)
        .get("/api/contexts")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      const contexts = response.body.data.contexts;
      expect(contexts.every((ctx: any) => ctx.user_id === userId)).toBe(true);
      expect(
        contexts.find((ctx: any) => ctx.id === otherUserContextId)
      ).toBeUndefined();
    });

    it("should prevent access to other users attributes", async () => {
      const response = await request(app)
        .get("/api/attributes")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      const attributes = response.body.data.attributes;
      expect(attributes.every((attr: any) => attr.user_id === userId)).toBe(
        true
      );
      expect(
        attributes.find((attr: any) => attr.id === otherUserAttributeId)
      ).toBeUndefined();
    });

    it("should prevent updating other users contexts", async () => {
      const response = await request(app)
        .put(`/api/contexts/${otherUserContextId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Malicious Update",
          description: "Trying to update other user data",
        })
        .expect(404);

      expect(response.body.success).toBe(false);

      // Verify original context unchanged
      const { data: contextData } = await supabaseAdmin
        .from("contexts")
        .select()
        .eq("id", otherUserContextId)
        .single();

      expect(contextData.name).toBe("Other User Work");
    });

    it("should prevent deleting other users contexts", async () => {
      const response = await request(app)
        .delete(`/api/contexts/${otherUserContextId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);

      // Verify context still exists
      const { data: contextData } = await supabaseAdmin
        .from("contexts")
        .select()
        .eq("id", otherUserContextId);

      expect(contextData).toHaveLength(1);
    });

    it("should prevent creating context-attribute assignments for other users data", async () => {
      const response = await request(app)
        .post("/api/context-attributes")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          context_id: userContextId,
          attribute_id: otherUserAttributeId, // Trying to assign other user's attribute
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should prevent access to other users privacy matrix", async () => {
      // Create some assignments for other user
      await supabaseAdmin.from("context_attributes").insert({
        user_id: otherUserId,
        context_id: otherUserContextId,
        attribute_id: otherUserAttributeId,
      });

      const response = await request(app)
        .get("/api/privacy-matrix")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      const matrix = response.body.data.matrix;

      // Should only see own attributes
      expect(matrix.every((row: any) => row.attribute.user_id === userId)).toBe(
        true
      );
      expect(
        matrix.find((row: any) => row.attribute.id === otherUserAttributeId)
      ).toBeUndefined();
    });
  });

  describe("JWT Token Security", () => {
    it("should reject expired tokens", async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "-1h" } // Expired 1 hour ago
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject malformed tokens", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.token.here")
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject tokens with incorrect signature", async () => {
      const fakeToken = jwt.sign({ userId: userId }, "wrong-secret");

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${fakeToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject tokens without userId claim", async () => {
      const invalidToken = jwt.sign(
        { email: testUser.email }, // Missing userId
        process.env.JWT_SECRET || "fallback-secret"
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Input Validation Security", () => {
    it("should sanitize SQL injection attempts in context names", async () => {
      const maliciousInput = {
        name: "'; DROP TABLE contexts; --",
        description: "SQL injection attempt",
        color: "#6366f1",
      };

      const response = await request(app)
        .post("/api/contexts")
        .set("Authorization", `Bearer ${userToken}`)
        .send(maliciousInput)
        .expect(400); // Should fail validation

      expect(response.body.success).toBe(false);

      // Verify contexts table still exists by making a valid request
      const validResponse = await request(app)
        .get("/api/contexts")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(validResponse.body.success).toBe(true);
    });

    it("should prevent XSS attempts in attribute values", async () => {
      const maliciousInput = {
        name: "Email",
        value: '<script>alert("xss")</script>',
        type: "email",
      };

      const response = await request(app)
        .post("/api/attributes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(maliciousInput)
        .expect(400); // Should fail email validation

      expect(response.body.success).toBe(false);
    });

    it("should validate email format in attributes", async () => {
      const invalidEmailInput = {
        name: "Email",
        value: "not-an-email",
        type: "email",
      };

      const response = await request(app)
        .post("/api/attributes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(invalidEmailInput)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should validate URL format in attributes", async () => {
      const invalidUrlInput = {
        name: "Website",
        value: "not-a-url",
        type: "url",
      };

      const response = await request(app)
        .post("/api/attributes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(invalidUrlInput)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Rate Limiting", () => {
    it("should apply rate limiting to auth endpoints", async () => {
      // Make multiple rapid requests to signup
      const requests = Array(15)
        .fill(null)
        .map((_, i) =>
          request(app)
            .post("/api/auth/signup")
            .send({
              email: `test${i}@spam.com`,
              password: "password123",
              confirmPassword: "password123",
            })
        );

      const responses = await Promise.all(requests);

      // Should have some rate limited responses (429)
      const rateLimited = responses.filter((res) => res.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe("Password Security", () => {
    it("should not expose password hashes in any response", async () => {
      // Check signup response
      const signupResponse = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "password-test@example.com",
          password: "testpassword123",
          confirmPassword: "testpassword123",
        })
        .expect(201);

      expect(signupResponse.body.data.user.password_hash).toBeUndefined();
      expect(signupResponse.body.data.user.password).toBeUndefined();

      // Check login response
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: "password-test@example.com",
          password: "testpassword123",
          confirmPassword: "testpassword123",
        })
        .expect(200);

      expect(loginResponse.body.data.user.password_hash).toBeUndefined();
      expect(loginResponse.body.data.user.password).toBeUndefined();

      // Check /me response
      const meResponse = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
        .expect(200);

      expect(meResponse.body.data.user.password_hash).toBeUndefined();
      expect(meResponse.body.data.user.password).toBeUndefined();

      // Cleanup
      await supabaseAdmin
        .from("users")
        .delete()
        .eq("email", "password-test@example.com");
    });

    it("should hash passwords with sufficient complexity", async () => {
      const email = "hash-test@example.com";

      await request(app)
        .post("/api/auth/signup")
        .send({
          email: email,
          password: "testpassword123",
          confirmPassword: "testpassword123",
        })
        .expect(201);

      // Check password hash in database
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("password_hash")
        .eq("email", email)
        .single();

      expect(userData).not.toBeNull();
      expect(userData!.password_hash).toBeDefined();
      expect(userData!.password_hash).not.toBe("testpassword123"); // Should be hashed
      expect(userData!.password_hash.startsWith("$2b$")).toBe(true); // bcrypt format
      expect(userData!.password_hash.length).toBeGreaterThan(50); // Sufficient length

      // Cleanup
      await supabaseAdmin.from("users").delete().eq("email", email);
    });
  });
});
