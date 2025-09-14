export type RequestStatus = "pending" | "approved" | "denied" | "revoked";

export interface IdentityRequest {
  id: number;
  requestor_user_id: number;
  requestee_user_id: number;
  context_id: number;
  purpose?: string;
  status: RequestStatus;
  requested_at: string;
  responded_at?: string;
  response_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIdentityRequestRequest {
  requestee_user_id: number;
  context_id: number;
  purpose?: string;
}

export interface RespondToRequestRequest {
  status: "approved" | "denied";
  response_message?: string;
}

export interface IdentityRequestWithDetails extends IdentityRequest {
  requestor_email?: string;
  requestee_email?: string;
  context_name?: string;
  context_color?: string;
}
