import request from "supertest";
import app from "../app";
import { supabaseAdmin } from "../services/supabase";

describe("Authentication Endpoints", () => {
  const testUser = {
    email: "test@example.com",
    password: "testpassword123",
    confirmPassword: "testpassword123",
  };

  // Clean up test data
  afterEach(async () => {
    await supabaseAdmin.from("users").delete().eq("email", testUser.email);
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password_hash).toBeUndefined(); // Should not expose password
    });

    it("should reject duplicate email addresses", async () => {
      // First signup
      await request(app).post("/api/auth/signup").send(testUser).expect(201);

      // Second signup with same email
      const response = await request(app)
        .post("/api/auth/signup")
        .send(testUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("already exists");
    });

    it("should validate email format", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "invalid-email",
          password: "testpassword123",
          confirmPassword: "testpassword123",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should enforce password requirements", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "test@example.com",
          password: "123", // Too short
          confirmPassword: "123",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create test user
      await request(app).post("/api/auth/signup").send(testUser);
    });

    it("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(testUser)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it("should reject incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should reject non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid credentials");
    });
  });

  describe("GET /api/auth/me", () => {
    let userToken: string;

    beforeEach(async () => {
      const signupResponse = await request(app)
        .post("/api/auth/signup")
        .send(testUser);

      userToken = signupResponse.body.data.token;
    });

    it("should return user data with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.password_hash).toBeUndefined();
    });

    it("should reject requests without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Access token required");
    });

    it("should reject requests with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
