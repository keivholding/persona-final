import { supabaseAdmin } from "../services/supabase";

// Global test setup
beforeAll(async () => {
  // Ensure test database is clean
  console.log("Setting up test environment...");
});

afterAll(async () => {
  // Clean up any remaining test data
  console.log("Cleaning up test environment...");

  // Clean up any test users that might have been left behind
  try {
    await supabaseAdmin.from("users").delete().ilike("email", "%test%");
  } catch (error) {
    console.warn("Cleanup warning:", error);
  }
});

// Increase timeout for database operations
jest.setTimeout(30000);
