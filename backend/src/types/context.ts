export interface Context {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContextDto {
  name: string;
  description?: string;
  color?: string;
  is_default?: boolean;
}

export interface UpdateContextDto {
  name?: string;
  description?: string;
  color?: string;
  is_default?: boolean;
}

export interface ContextStats {
  total_contexts: number;
  total_attributes: number;
  visibility_coverage: number;
}
