import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import contextAttributeService from "../services/contextAttributeService";
import { CreateContextAttributeRequest, ApiResponse } from "../types";

export class ContextAttributeController {
  // GET /api/privacy-matrix - Get the privacy matrix for the user
  async getPrivacyMatrix(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const matrix = await contextAttributeService.getPrivacyMatrix(userId);

      const response: ApiResponse = {
        success: true,
        data: matrix,
        message: "Privacy matrix retrieved successfully",
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Get privacy matrix error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to get privacy matrix";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to retrieve privacy matrix",
      };
      res.status(500).json(response);
    }
  }

  // POST /api/context-attributes - Assign attribute to context
  async assignAttributeToContext(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: CreateContextAttributeRequest = req.body;

      const assignment = await contextAttributeService.assignAttributeToContext(
        userId,
        data
      );

      const response: ApiResponse = {
        success: true,
        data: { assignment },
        message: "Attribute assigned to context successfully",
      };
      res.status(201).json(response);
    } catch (error: unknown) {
      console.error("Assign attribute to context error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to assign attribute to context";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to assign attribute to context",
      };
      res.status(400).json(response);
    }
  }

  // DELETE /api/context-attributes/:contextId/:attributeId - Remove attribute from context
  async removeAttributeFromContext(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { contextId, attributeId } = req.params;

      await contextAttributeService.removeAttributeFromContext(
        userId,
        contextId,
        attributeId
      );

      const response: ApiResponse = {
        success: true,
        message: "Attribute removed from context successfully",
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Remove attribute from context error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove attribute from context";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to remove attribute from context",
      };
      res.status(500).json(response);
    }
  }

  // GET /api/contexts/:contextId/attributes - Get all attributes for a context
  async getAttributesForContext(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { contextId } = req.params;

      const attributes = await contextAttributeService.getAttributesForContext(
        userId,
        contextId
      );

      const response: ApiResponse = {
        success: true,
        data: { attributes },
        message: "Context attributes retrieved successfully",
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Get context attributes error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to get context attributes";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to retrieve context attributes",
      };
      res.status(500).json(response);
    }
  }

  // GET /api/attributes/:attributeId/contexts - Get all contexts for an attribute
  async getContextsForAttribute(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { attributeId } = req.params;

      const contexts = await contextAttributeService.getContextsForAttribute(
        userId,
        attributeId
      );

      const response: ApiResponse = {
        success: true,
        data: { contexts },
        message: "Attribute contexts retrieved successfully",
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Get attribute contexts error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to get attribute contexts";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to retrieve attribute contexts",
      };
      res.status(500).json(response);
    }
  }
}

export default new ContextAttributeController();
