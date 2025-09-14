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

export interface UserContext {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export interface UserSearchResult {
  id: number;
  email: string;
  created_at: string;
  contexts: UserContext[];
}

export const usersApi = {
  // Search for a user by ID
  searchUserById: async (userId: number): Promise<UserSearchResult> => {
    const response = await fetch(`${API_BASE}/users/search/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data.data.user;
  },
};
