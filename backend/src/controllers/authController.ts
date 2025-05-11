import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { email, password, first_name, last_name } = req.body;

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Invalid email format' 
        });
      }

      const result = await UserService.createUser({
        email,
        password,
        first_name,
        last_name
      });

      res.status(201).json({
        message: 'Account created successfully',
        token: result.token,
        user: result.user
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: error.message || 'Failed to create account' 
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      const result = await UserService.loginUser({ email, password });

      res.json({
        message: 'Login successful',
        token: result.token,
        user: result.user
      });
    } catch (error: any) {
      res.status(401).json({ 
        error: error.message || 'Login failed' 
      });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      const user = await UserService.getUserById(req.userId!);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to get user information' 
      });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const updates = req.body;
      const user = await UserService.updateUser(req.userId!, updates);
      
      res.json({ 
        message: 'Profile updated successfully',
        user 
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: error.message || 'Failed to update profile' 
      });
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    // JWT is stateless, so logout is handled client-side
    // In production, you might maintain a token blacklist
    res.json({ message: 'Logged out successfully' });
  }
}
