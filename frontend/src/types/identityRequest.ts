export type RequestStatus = 'pending' | 'approved' | 'denied' | 'revoked';

export interface IdentityRequest {
  id: string;
  requestor_user_id: string;
  requestee_user_id: string;
  context_id: string;
  purpose?: string;
  status: RequestStatus;
  requested_at: string;
  responded_at?: string;
  response_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIdentityRequestRequest {
  requestee_user_id: string;
  context_id: string;
  purpose?: string;
}

export interface RespondToRequestRequest {
  status: 'approved' | 'denied';
  response_message?: string;
}

export interface IdentityRequestWithDetails extends IdentityRequest {
  // Enhanced version with related data
  requestor_email?: string;
  requestee_email?: string;
  context_name?: string;
  context_color?: string;
  shared_attributes?: Array<{
    id: string;
    name: string;
    value: string;
    type: string;
  }>;
}

// For the frontend requests list
export interface RequestListItem {
  id: string;
  requestor_email?: string;
  requestee_email?: string;
  status: RequestStatus;
  requested_at: string;
  responded_at?: string;
  context_name: string;
  context_color: string;
  purpose?: string;
  response_message?: string;
  attribute_count?: number; // How many attributes would be shared
}
