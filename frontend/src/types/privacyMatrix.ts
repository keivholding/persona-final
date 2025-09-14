import { type Attribute } from "./attribute";
import { type Context } from "./context";

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

export interface PrivacyMatrixData {
  attributes: Attribute[];
  contexts: Context[];
  matrix: PrivacyMatrixRow[];
}
