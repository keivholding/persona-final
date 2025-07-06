import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AttributeService } from '../services/attributeService';

export class AttributeController {
  static async getAttributes(req: AuthRequest, res: Response) {
    try {
      const attributes = await AttributeService.getUserAttributes(req.userId!);
      res.json({
        success: true,
        data: attributes,
        count: attributes.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch attributes'
      });
    }
  }

  static async getAttribute(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const attribute = await AttributeService.getAttributeById(req.userId!, id);
      
      if (!attribute) {
        return res.status(404).json({
          success: false,
          error: 'Attribute not found'
        });
      }

      res.json({
        success: true,
        data: attribute
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch attribute'
      });
    }
  }

  static async createAttribute(req: AuthRequest, res: Response) {
    try {
      const { name, value, type } = req.body;
      
      if (!name || !value || !type) {
        return res.status(400).json({
          success: false,
          error: 'Name, value, and type are required'
        });
      }

      const attribute = await AttributeService.createAttribute(req.userId!, {
        name,
        value,
        type
      });

      res.status(201).json({
        success: true,
        message: 'Attribute created successfully',
        data: attribute
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create attribute'
      });
    }
  }

  static async updateAttribute(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const attribute = await AttributeService.updateAttribute(req.userId!, id, updates);

      res.json({
        success: true,
        message: 'Attribute updated successfully',
        data: attribute
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update attribute'
      });
    }
  }

  static async deleteAttribute(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      await AttributeService.deleteAttribute(req.userId!, id);
      
      res.json({
        success: true,
        message: 'Attribute deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete attribute'
      });
    }
  }
}
