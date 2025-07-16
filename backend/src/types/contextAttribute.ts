export interface ContextAttribute {
  id: string;
  user_id: string;
  context_id: string;
  attribute_id: string;
  created_at: Date;
}

export interface PrivacyMatrixRow {
  attribute: {
    id: string;
    name: string;
    type: string;
    value: string;
  };
  contexts: Record<string, boolean>;
}

export interface PrivacyMatrix {
  contexts: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  matrix: PrivacyMatrixRow[];
}

export interface UpdateVisibilityDto {
  context_id: string;
  attribute_id: string;
  visible: boolean;
}
