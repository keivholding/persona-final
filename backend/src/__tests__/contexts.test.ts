import request from 'supertest';
import app from '../app';
import { ContextService } from '../services/contextService';

jest.mock('../services/contextService');
const mockContextService = ContextService as jest.Mocked<typeof ContextService>;

// Mock JWT middleware
jest.mock('../middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.userId = 'user-123';
    next();
  }
}));

describe('Context Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/contexts', () => {
    it('should return user contexts', async () => {
      const mockContexts = [
        {
          id: 'ctx-1',
          user_id: 'user-123',
          name: 'Work',
          description: 'Professional context',
          color: '#3B82F6',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'ctx-2',
          user_id: 'user-123',
          name: 'Personal',
          description: 'Personal context',
          color: '#10B981',
          is_default: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockContextService.getUserContexts.mockResolvedValue(mockContexts);

      const response = await request(app)
        .get('/api/contexts')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockContexts,
        count: 2
      });
    });

    it('should handle service errors', async () => {
      mockContextService.getUserContexts.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/contexts')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('POST /api/contexts', () => {
    it('should create a new context', async () => {
      const contextData = {
        name: 'New Context',
        description: 'A new context',
        color: '#EF4444'
      };

      const mockContext = {
        id: 'ctx-new',
        user_id: 'user-123',
        ...contextData,
        is_default: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockContextService.createContext.mockResolvedValue(mockContext);

      const response = await request(app)
        .post('/api/contexts')
        .send(contextData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Context created successfully',
        data: mockContext
      });

      expect(mockContextService.createContext).toHaveBeenCalledWith('user-123', contextData);
    });

    it('should return 400 without name', async () => {
      const response = await request(app)
        .post('/api/contexts')
        .send({ description: 'No name provided' })
        .expect(400);

      expect(response.body.error).toBe('Context name is required');
    });
  });

  describe('PUT /api/contexts/:id', () => {
    it('should update a context', async () => {
      const updates = { name: 'Updated Context' };
      const mockUpdatedContext = {
        id: 'ctx-1',
        user_id: 'user-123',
        name: 'Updated Context',
        description: 'Original description',
        color: '#3B82F6',
        is_default: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockContextService.updateContext.mockResolvedValue(mockUpdatedContext);

      const response = await request(app)
        .put('/api/contexts/ctx-1')
        .send(updates)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Context updated successfully',
        data: mockUpdatedContext
      });

      expect(mockContextService.updateContext).toHaveBeenCalledWith('user-123', 'ctx-1', updates);
    });
  });

  describe('DELETE /api/contexts/:id', () => {
    it('should delete a context', async () => {
      mockContextService.deleteContext.mockResolvedValue();

      const response = await request(app)
        .delete('/api/contexts/ctx-1')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Context deleted successfully'
      });

      expect(mockContextService.deleteContext).toHaveBeenCalledWith('user-123', 'ctx-1');
    });

    it('should handle deletion errors', async () => {
      mockContextService.deleteContext.mockRejectedValue(new Error('Cannot delete your only context'));

      const response = await request(app)
        .delete('/api/contexts/ctx-1')
        .expect(400);

      expect(response.body.error).toBe('Cannot delete your only context');
    });
  });
});
