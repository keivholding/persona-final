export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
  expiresIn: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Express Request Extensions
export interface AuthenticatedRequest extends Request {
  user?: PublicUser;
}

// Re-export context types
export * from "./context";

// Re-export attribute types
export * from "./attribute";

// Re-export context-attribute types
export * from "./contextAttribute";

// Re-export identity request types
export * from "./identityRequest";
