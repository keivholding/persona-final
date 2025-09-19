import type { Context, CreateContextRequest, UpdateContextRequest, ContextStats } from '../../types/context';

const API_BASE = '/api';

class ContextApi {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getContexts(): Promise<Context[]> {
    const response = await this.request<{ data: Context[] }>('/contexts');
    return response.data;
  }

  async getContext(id: string): Promise<Context> {
    const response = await this.request<{ data: Context }>(`/contexts/${id}`);
    return response.data;
  }

  async createContext(data: CreateContextRequest): Promise<Context> {
    const response = await this.request<{ data: Context }>('/contexts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateContext(id: string, data: UpdateContextRequest): Promise<Context> {
    const response = await this.request<{ data: Context }>(`/contexts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteContext(id: string): Promise<void> {
    await this.request(`/contexts/${id}`, {
      method: 'DELETE',
    });
  }

  async getContextStats(): Promise<ContextStats> {
    const response = await this.request<{ data: ContextStats }>('/contexts/stats');
    return response.data;
  }
}

export const contextApi = new ContextApi();
