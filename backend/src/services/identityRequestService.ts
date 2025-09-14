import { supabaseAdmin as supabase } from "./supabase";
import {
  IdentityRequest,
  CreateIdentityRequestRequest,
  RespondToRequestRequest,
  IdentityRequestWithDetails,
} from "../types/identityRequest";

export class IdentityRequestService {
  // Create a new identity request
  static async createRequest(
    requestorUserId: number,
    requestData: CreateIdentityRequestRequest
  ): Promise<IdentityRequest> {
    const { data, error } = await supabase
      .from("identity_requests")
      .insert({
        requestor_user_id: requestorUserId,
        requestee_user_id: requestData.requestee_user_id,
        context_id: requestData.context_id,
        purpose: requestData.purpose,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create identity request: ${error.message}`);
    }

    return data;
  }

  // Get all requests received by a user (incoming requests)
  static async getReceivedRequests(
    userId: number
  ): Promise<IdentityRequestWithDetails[]> {
    const { data, error } = await supabase
      .from("identity_requests")
      .select(
        `
        *,
        contexts!context_id (
          name,
          color,
          context_attributes!inner (
            attributes!inner (
              id,
              name,
              value,
              type
            )
          )
        ),
        requestor:users!requestor_user_id (
          email
        )
      `
      )
      .eq("requestee_user_id", userId)
      .order("requested_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch received requests: ${error.message}`);
    }

    // Transform the data to flatten the attributes
    const transformedData =
      data?.map((request: any) => {
        const context = request.contexts;
        const attributes =
          context?.context_attributes?.map((ca: any) => ca.attributes) || [];

        return {
          ...request,
          context_name: context?.name,
          context_color: context?.color,
          requestor_email: request.requestor?.email,
          shared_attributes: attributes,
        };
      }) || [];

    return transformedData;
  }

  // Get all requests sent by a user (outgoing requests)
  static async getSentRequests(
    userId: number
  ): Promise<IdentityRequestWithDetails[]> {
    const { data, error } = await supabase
      .from("identity_requests")
      .select(
        `
        *,
        contexts!context_id (
          name,
          color,
          context_attributes!inner (
            attributes!inner (
              id,
              name,
              value,
              type
            )
          )
        ),
        requestee:users!requestee_user_id (
          email
        )
      `
      )
      .eq("requestor_user_id", userId)
      .order("requested_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch sent requests: ${error.message}`);
    }

    // Transform the data to flatten the attributes and add requestee email
    const transformedData =
      data?.map((request: any) => {
        const context = request.contexts;
        const attributes =
          context?.context_attributes?.map((ca: any) => ca.attributes) || [];

        return {
          ...request,
          context_name: context?.name,
          context_color: context?.color,
          requestee_email: request.requestee?.email,
          shared_attributes: request.status === "approved" ? attributes : [], // Only show attributes if approved
        };
      }) || [];

    return transformedData;
  }

  // Get a specific request by ID (with permission check)
  static async getRequestById(
    requestId: number,
    userId: number
  ): Promise<IdentityRequestWithDetails | null> {
    const { data, error } = await supabase
      .from("identity_requests")
      .select(
        `
        *,
        contexts!context_id (
          name,
          color
        )
      `
      )
      .eq("id", requestId)
      .or(`requestor_user_id.eq.${userId},requestee_user_id.eq.${userId}`)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No matching request found
      }
      throw new Error(`Failed to fetch request: ${error.message}`);
    }

    return data;
  }

  // Respond to a request (approve/deny) - only the requestee can do this
  static async respondToRequest(
    requestId: number,
    requesteeUserId: number,
    response: RespondToRequestRequest
  ): Promise<IdentityRequest> {
    // First verify the user owns this request
    const existingRequest = await this.getRequestById(
      requestId,
      requesteeUserId
    );
    if (
      !existingRequest ||
      existingRequest.requestee_user_id !== requesteeUserId
    ) {
      throw new Error("Request not found or access denied");
    }

    // Allow status changes - users can change their mind about approval/denial

    const { data, error } = await supabase
      .from("identity_requests")
      .update({
        status: response.status,
        response_message: response.response_message,
        responded_at: new Date().toISOString(), // Update each time status changes
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("requestee_user_id", requesteeUserId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to respond to request: ${error.message}`);
    }

    return data;
  }

  // Revoke an approved request (either party can do this)
  static async revokeRequest(
    requestId: number,
    userId: number
  ): Promise<IdentityRequest> {
    const existingRequest = await this.getRequestById(requestId, userId);
    if (!existingRequest) {
      throw new Error("Request not found or access denied");
    }

    if (existingRequest.status !== "approved") {
      throw new Error("Only approved requests can be revoked");
    }

    const { data, error } = await supabase
      .from("identity_requests")
      .update({
        status: "revoked",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .or(`requestor_user_id.eq.${userId},requestee_user_id.eq.${userId}`)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to revoke request: ${error.message}`);
    }

    return data;
  }

  // Delete a request (only if pending or denied)
  static async deleteRequest(requestId: number, userId: number): Promise<void> {
    const existingRequest = await this.getRequestById(requestId, userId);
    if (!existingRequest) {
      throw new Error("Request not found or access denied");
    }

    // Only allow deletion if it's the requestor and status is pending/denied
    if (existingRequest.requestor_user_id !== userId) {
      throw new Error("Only the requestor can delete requests");
    }

    if (existingRequest.status === "approved") {
      throw new Error("Cannot delete approved requests. Use revoke instead.");
    }

    const { error } = await supabase
      .from("identity_requests")
      .delete()
      .eq("id", requestId)
      .eq("requestor_user_id", userId);

    if (error) {
      throw new Error(`Failed to delete request: ${error.message}`);
    }
  }

  // Get pending requests count for a user
  static async getPendingRequestsCount(userId: number): Promise<number> {
    const { count, error } = await supabase
      .from("identity_requests")
      .select("*", { count: "exact", head: true })
      .eq("requestee_user_id", userId)
      .eq("status", "pending");

    if (error) {
      throw new Error(`Failed to get pending requests count: ${error.message}`);
    }

    return count || 0;
  }
}
