import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ContextService } from '../services/contextService';

export class ContextController {
  static async getContexts(req: AuthRequest, res: Response) {
    try {
      const contexts = await ContextService.getUserContexts(req.userId!);
      res.json({
        success: true,
        data: contexts,
        count: contexts.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch contexts'
      });
    }
  }

  static async getContext(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const context = await ContextService.getContextById(req.userId!, id);
      
      if (!context) {
        return res.status(404).json({
          success: false,
          error: 'Context not found'
        });
      }

      res.json({
        success: true,
        data: context
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch context'
      });
    }
  }

  static async createContext(req: AuthRequest, res: Response) {
    try {
      const { name, description, color, is_default } = req.body;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Context name is required'
        });
      }

      const context = await ContextService.createContext(req.userId!, {
        name,
        description,
        color,
        is_default
      });

      res.status(201).json({
        success: true,
        message: 'Context created successfully',
        data: context
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create context'
      });
    }
  }

  static async updateContext(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const context = await ContextService.updateContext(req.userId!, id, updates);

      res.json({
        success: true,
        message: 'Context updated successfully',
        data: context
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update context'
      });
    }
  }

  static async deleteContext(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      await ContextService.deleteContext(req.userId!, id);
      
      res.json({
        success: true,
        message: 'Context deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete context'
      });
    }
  }

  static async getContextStats(req: AuthRequest, res: Response) {
    try {
      const stats = await ContextService.getContextStats(req.userId!);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get context stats'
      });
    }
  }
}
