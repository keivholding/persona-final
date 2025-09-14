export type AttributeType =
  | "text"
  | "email"
  | "phone"
  | "url"
  | "image"
  | "date"
  | "address";

export interface Attribute {
  id: string;
  user_id: string;
  name: string;
  value: string;
  type: AttributeType;
  created_at: string;
  updated_at: string;
}

export interface CreateAttributeRequest {
  name: string;
  value: string;
  type: AttributeType;
}

export interface UpdateAttributeRequest {
  name?: string;
  value?: string;
  type?: AttributeType;
}
