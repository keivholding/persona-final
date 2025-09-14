import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { IdentityRequestService } from "../services/identityRequestService";
import {
  CreateIdentityRequestRequest,
  RespondToRequestRequest,
} from "../types/identityRequest";
import { ApiResponse } from "../types";

export class IdentityRequestController {
  // POST /api/identity-requests - Create a new request
  async createRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.user!.id);
      const requestData: CreateIdentityRequestRequest = req.body;

      // Validate required fields
      if (!requestData.requestee_user_id || !requestData.context_id) {
        const response: ApiResponse = {
          success: false,
          error: "Missing required fields: requestee_user_id, context_id",
        };
        res.status(400).json(response);
        return;
      }

      // Prevent users from requesting their own contexts
      if (requestData.requestee_user_id === userId) {
        const response: ApiResponse = {
          success: false,
          error: "Cannot request access to your own context",
        };
        res.status(400).json(response);
        return;
      }

      const request = await IdentityRequestService.createRequest(
        userId,
        requestData
      );

      const response: ApiResponse = {
        success: true,
        data: request,
        message: "Identity request created successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating identity request:", error);
      const response: ApiResponse = {
        success: false,
        error: "Failed to create identity request",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  // GET /api/identity-requests/received - Get requests received by the user
  async getReceivedRequests(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = parseInt(req.user!.id);
      const requests = await IdentityRequestService.getReceivedRequests(userId);

      const response: ApiResponse = {
        success: true,
        data: { requests, count: requests.length },
      };
      res.json(response);
    } catch (error) {
      console.error("Error fetching received requests:", error);
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch received requests",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  // GET /api/identity-requests/sent - Get requests sent by the user
  async getSentRequests(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = parseInt(req.user!.id);
      const requests = await IdentityRequestService.getSentRequests(userId);

      const response: ApiResponse = {
        success: true,
        data: { requests, count: requests.length },
      };
      res.json(response);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch sent requests",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  // GET /api/identity-requests/:id - Get a specific request
  async getRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.user!.id);
      const requestId = parseInt(req.params.id);

      if (isNaN(requestId)) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid request ID",
        };
        res.status(400).json(response);
        return;
      }

      const request = await IdentityRequestService.getRequestById(
        requestId,
        userId
      );

      if (!request) {
        const response: ApiResponse = {
          success: false,
          error: "Request not found",
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: request,
      };
      res.json(response);
    } catch (error) {
      console.error("Error fetching request:", error);
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch request",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/identity-requests/:id/respond - Respond to a request (approve/deny)
  async respondToRequest(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = parseInt(req.user!.id);
      const requestId = parseInt(req.params.id);
      const responseData: RespondToRequestRequest = req.body;

      if (isNaN(requestId)) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid request ID",
        };
        res.status(400).json(response);
        return;
      }

      if (
        !responseData.status ||
        !["approved", "denied"].includes(responseData.status)
      ) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid status. Must be "approved" or "denied"',
        };
        res.status(400).json(response);
        return;
      }

      const updatedRequest = await IdentityRequestService.respondToRequest(
        requestId,
        userId,
        responseData
      );

      const response: ApiResponse = {
        success: true,
        data: updatedRequest,
        message: `Request ${responseData.status} successfully`,
      };
      res.json(response);
    } catch (error) {
      console.error("Error responding to request:", error);
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      const response: ApiResponse = {
        success: false,
        error: "Failed to respond to request",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(statusCode).json(response);
    }
  }

  // PUT /api/identity-requests/:id/revoke - Revoke an approved request
  async revokeRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.user!.id);
      const requestId = parseInt(req.params.id);

      if (isNaN(requestId)) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid request ID",
        };
        res.status(400).json(response);
        return;
      }

      const updatedRequest = await IdentityRequestService.revokeRequest(
        requestId,
        userId
      );

      const response: ApiResponse = {
        success: true,
        data: updatedRequest,
        message: "Request revoked successfully",
      };
      res.json(response);
    } catch (error) {
      console.error("Error revoking request:", error);
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      const response: ApiResponse = {
        success: false,
        error: "Failed to revoke request",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(statusCode).json(response);
    }
  }

  // DELETE /api/identity-requests/:id - Delete a request
  async deleteRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.user!.id);
      const requestId = parseInt(req.params.id);

      if (isNaN(requestId)) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid request ID",
        };
        res.status(400).json(response);
        return;
      }

      await IdentityRequestService.deleteRequest(requestId, userId);

      const response: ApiResponse = {
        success: true,
        message: "Request deleted successfully",
      };
      res.json(response);
    } catch (error) {
      console.error("Error deleting request:", error);
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      const response: ApiResponse = {
        success: false,
        error: "Failed to delete request",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(statusCode).json(response);
    }
  }

  // GET /api/identity-requests/pending/count - Get count of pending requests
  async getPendingCount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = parseInt(req.user!.id);
      const count = await IdentityRequestService.getPendingRequestsCount(
        userId
      );

      const response: ApiResponse = {
        success: true,
        data: { count },
      };
      res.json(response);
    } catch (error) {
      console.error("Error fetching pending count:", error);
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch pending requests count",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }
}

// Export instance for use in routes
export const identityRequestController = new IdentityRequestController();
