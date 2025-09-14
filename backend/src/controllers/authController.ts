import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const result = await UserService.createUser({ email, password });

      res.status(201).json({
        message: 'User created successfully',
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          created_at: result.user.created_at
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await UserService.loginUser({ email, password });

      res.json({
        message: 'Login successful',
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email
        }
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      // Get current user info
      res.json({ userId: req.userId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
import { AuthRequest } from './auth';
