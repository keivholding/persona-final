import request from 'supertest';
import app from '../app';
import { UserService } from '../services/userService';

// Mock the UserService
jest.mock('../services/userService');
const mockUserService = UserService as jest.Mocked<typeof UserService>;

describe('Authentication Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        first_name: 'Test',
        last_name: 'User'
      };

      const mockUser = {
        id: 'user-123',
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        created_at: new Date()
      };

      const mockToken = 'jwt-token-123';

      mockUserService.createUser.mockResolvedValue({
        user: mockUser,
        token: mockToken
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Account created successfully',
        token: mockToken,
        user: mockUser
      });

      expect(mockUserService.createUser).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name
      });
    });

    it('should return 400 with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ password: 'SecurePass123!' })
        .expect(400);

      expect(response.body.error).toBe('Email and password are required');
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!'
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });

    it('should handle service errors', async () => {
      mockUserService.createUser.mockRejectedValue(new Error('User already exists'));

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'existing@example.com',
          password: 'SecurePass123!'
        })
        .expect(400);

      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      const mockUser = {
        id: 'user-123',
        email: credentials.email,
        created_at: new Date()
      };

      const mockToken = 'jwt-token-123';

      mockUserService.loginUser.mockResolvedValue({
        user: mockUser,
        token: mockToken
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Login successful',
        token: mockToken,
        user: mockUser
      });
    });

    it('should return 400 with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.error).toBe('Email and password are required');
    });

    it('should handle invalid credentials', async () => {
      mockUserService.loginUser.mockRejectedValue(new Error('Invalid email or password'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: new Date()
      };

      mockUserService.getUserById.mockResolvedValue(mockUser);

      // Mock JWT verification
      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        callback(null, { userId: 'user-123', email: 'test@example.com' });
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.user).toMatchObject(mockUser);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });
});
