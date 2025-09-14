import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import attributeService from "../services/attributeService";
import {
  CreateAttributeRequest,
  UpdateAttributeRequest,
  ApiResponse,
} from "../types";

export class AttributeController {
  // GET /api/attributes - Get all attributes for authenticated user
  async getAttributes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const attributes = await attributeService.getAttributesByUserId(userId);

      const response: ApiResponse = {
        success: true,
        data: { attributes },
        message: "Attributes retrieved successfully",
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Get attributes error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to get attributes";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to retrieve attributes",
      };
      res.status(500).json(response);
    }
  }

  // POST /api/attributes - Create new attribute
  async createAttribute(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const attributeData: CreateAttributeRequest = req.body;

      const newAttribute = await attributeService.createAttribute(
        userId,
        attributeData
      );

      const response: ApiResponse = {
        success: true,
        data: { attribute: newAttribute },
        message: "Attribute created successfully",
      };
      res.status(201).json(response);
    } catch (error: unknown) {
      console.error("Create attribute error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create attribute";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to create attribute",
      };
      res.status(500).json(response);
    }
  }

  // GET /api/attributes/:id - Get specific attribute
  async getAttribute(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const attributeId = req.params.id;

      const attribute = await attributeService.getAttributeById(
        attributeId,
        userId
      );

      if (!attribute) {
        const response: ApiResponse = {
          success: false,
          error: "Attribute not found or unauthorized",
          message: "Attribute not found",
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { attribute },
        message: "Attribute retrieved successfully",
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Get attribute error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to get attribute";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to retrieve attribute",
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/attributes/:id - Update attribute
  async updateAttribute(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const attributeId = req.params.id;
      const updates: UpdateAttributeRequest = req.body;

      const attribute = await attributeService.updateAttribute(
        attributeId,
        userId,
        updates
      );

      const response: ApiResponse = {
        success: true,
        data: { attribute },
        message: "Attribute updated successfully",
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Update attribute error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to update attribute";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to update attribute",
      };
      res.status(500).json(response);
    }
  }

  // DELETE /api/attributes/:id - Delete attribute
  async deleteAttribute(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const attributeId = req.params.id;

      await attributeService.deleteAttribute(attributeId, userId);

      const response: ApiResponse = {
        success: true,
        message: "Attribute deleted successfully",
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Delete attribute error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to delete attribute";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to delete attribute",
      };
      res.status(500).json(response);
    }
  }

  // GET /api/attributes/type/:type - Get attributes by type
  async getAttributesByType(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const type = req.params.type;

      const attributes = await attributeService.getAttributesByType(
        userId,
        type
      );

      const response: ApiResponse = {
        success: true,
        data: { attributes },
        message: `${type} attributes retrieved successfully`,
      };
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error("Get attributes by type error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to get attributes by type";

      const response: ApiResponse = {
        success: false,
        error: message,
        message: "Failed to retrieve attributes by type",
      };
      res.status(500).json(response);
    }
  }
}

export default new AttributeController();
