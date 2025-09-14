import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ContextService } from '../services/contextService';

export class ContextController {
  static async getContexts(req: AuthRequest, res: Response) {
    try {
      const contexts = await ContextService.getUserContexts(req.userId!);
      res.json(contexts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createContext(req: AuthRequest, res: Response) {
    try {
      const { name, description, color } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Context name is required' });
      }

      const context = await ContextService.createContext(req.userId!, {
        name,
        description,
        color
      });

      res.status(201).json(context);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateContext(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const context = await ContextService.updateContext(req.userId!, id, updates);
      res.json(context);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteContext(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      await ContextService.deleteContext(req.userId!, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
