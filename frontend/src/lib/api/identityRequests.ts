import type { 
  IdentityRequest, 
  CreateIdentityRequestRequest, 
  RespondToRequestRequest,
  IdentityRequestWithDetails 
} from '../../types/identityRequest';

const API_BASE = 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Handle API response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Access token required');
    }
    
    throw new Error(errorData.error || errorData.message || `Request failed: ${response.status}`);
  }
  return response.json();
};

export const identityRequestsApi = {
  // Create a new identity request
  createRequest: async (requestData: CreateIdentityRequestRequest): Promise<IdentityRequest> => {
    const response = await fetch(`${API_BASE}/identity-requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    
    const result = await handleResponse(response);
    return result.data;
  },

  // Get requests received by the user
  getReceivedRequests: async (): Promise<IdentityRequestWithDetails[]> => {
    const response = await fetch(`${API_BASE}/identity-requests/received`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const result = await handleResponse(response);
    return result.data.requests;
  },

  // Get requests sent by the user
  getSentRequests: async (): Promise<IdentityRequestWithDetails[]> => {
    const response = await fetch(`${API_BASE}/identity-requests/sent`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const result = await handleResponse(response);
    return result.data.requests;
  },

  // Get a specific request
  getRequest: async (requestId: string): Promise<IdentityRequestWithDetails> => {
    const response = await fetch(`${API_BASE}/identity-requests/${requestId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const result = await handleResponse(response);
    return result.data;
  },

  // Respond to a request (approve/deny)
  respondToRequest: async (
    requestId: string, 
    responseData: RespondToRequestRequest
  ): Promise<IdentityRequest> => {
    const response = await fetch(`${API_BASE}/identity-requests/${requestId}/respond`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(responseData),
    });
    
    const result = await handleResponse(response);
    return result.data;
  },

  // Revoke an approved request
  revokeRequest: async (requestId: string): Promise<IdentityRequest> => {
    const response = await fetch(`${API_BASE}/identity-requests/${requestId}/revoke`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    
    const result = await handleResponse(response);
    return result.data;
  },

  // Delete a request
  deleteRequest: async (requestId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/identity-requests/${requestId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    await handleResponse(response);
  },

  // Get pending requests count
  getPendingCount: async (): Promise<number> => {
    const response = await fetch(`${API_BASE}/identity-requests/pending/count`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const result = await handleResponse(response);
    return result.data.count;
  },
};
