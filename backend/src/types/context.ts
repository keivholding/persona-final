export interface Context {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContextDto {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateContextDto {
  name?: string;
  description?: string;
  color?: string;
}
