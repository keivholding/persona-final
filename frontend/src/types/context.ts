export interface Context {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContextRequest {
  name: string;
  description: string;
  color?: string;
}

export interface UpdateContextRequest {
  name?: string;
  description?: string;
  color?: string;
}
