import { type PrivacyMatrixData, type CreateContextAttributeRequest } from "../../../types/privacyMatrix";

const API_BASE_URL = "http://localhost:3001/api";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("auth_token");

// Get the privacy matrix (all attributes vs all contexts)
export const getPrivacyMatrix = async (): Promise<PrivacyMatrixData> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/privacy-matrix`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch privacy matrix");
  }

  return data.data;
};

// Assign an attribute to a context
export const assignAttributeToContext = async (assignment: CreateContextAttributeRequest): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/context-attributes`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assignment),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to assign attribute to context");
  }
};

// Remove an attribute from a context
export const removeAttributeFromContext = async (contextId: string, attributeId: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/context-attributes/${contextId}/${attributeId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to remove attribute from context");
  }
};
