export interface Context {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContextRequest {
  name: string;
  description?: string;
  color?: string;
  is_default?: boolean;
}

export interface UpdateContextRequest {
  name?: string;
  description?: string;
  color?: string;
  is_default?: boolean;
}

export interface ContextStats {
  total_contexts: number;
  total_attributes: number;
  total_associations: number;
  visibility_coverage: number;
}

export interface ContextApiResponse {
  success: boolean;
  data?: Context | Context[];
  count?: number;
  message?: string;
  error?: string;
}
