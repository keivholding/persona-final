export interface ContextAttribute {
  id: string;
  context_id: string;
  attribute_id: string;
  user_id: string;
  created_at: string;
}

export interface CreateContextAttributeRequest {
  context_id: string | number;
  attribute_id: string | number;
}

export interface PrivacyMatrixRow {
  attribute: {
    id: string;
    name: string;
    value: string;
    type: string;
  };
  contexts: {
    [contextId: string]: boolean; // true if attribute is assigned to context
  };
}

export interface PrivacyMatrixResponse {
  attributes: any[]; // Full attribute objects
  contexts: any[]; // Full context objects
  matrix: PrivacyMatrixRow[];
}
