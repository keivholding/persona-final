import { type Context, type CreateContextRequest, type UpdateContextRequest } from "../../../types/context";

const API_BASE_URL = "http://localhost:3001/api";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("auth_token");

// Get all contexts for current user
export const getContexts = async (): Promise<Context[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/contexts`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch contexts");
  }

  return data.data.contexts;
};

// Create a new context
export const createContext = async (contextData: CreateContextRequest): Promise<Context> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/contexts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contextData),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to create context");
  }

  return data.data.context;
};

// Update an existing context
export const updateContext = async (
  contextId: string,
  updates: UpdateContextRequest
): Promise<Context> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/contexts/${contextId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to update context");
  }

  return data.data.context;
};

// Delete a context
export const deleteContext = async (contextId: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/contexts/${contextId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to delete context");
  }
};
