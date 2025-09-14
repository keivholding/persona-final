import { type Attribute, type CreateAttributeRequest, type UpdateAttributeRequest } from "../../../types/attribute";

const API_BASE_URL = "http://localhost:3001/api";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("auth_token");

// Get all attributes for current user
export const getAttributes = async (): Promise<Attribute[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/attributes`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch attributes");
  }

  return data.data.attributes;
};

// Create a new attribute
export const createAttribute = async (attributeData: CreateAttributeRequest): Promise<Attribute> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/attributes`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attributeData),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to create attribute");
  }

  return data.data.attribute;
};

// Update an existing attribute
export const updateAttribute = async (
  attributeId: string,
  updates: UpdateAttributeRequest
): Promise<Attribute> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/attributes/${attributeId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to update attribute");
  }

  return data.data.attribute;
};

// Delete an attribute
export const deleteAttribute = async (attributeId: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/attributes/${attributeId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to delete attribute");
  }
};

// Get attributes by type
export const getAttributesByType = async (type: string): Promise<Attribute[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/attributes/type/${type}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch attributes by type");
  }

  return data.data.attributes;
};
