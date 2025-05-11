import { supabase } from './supabase';
import { User, PublicUser, CreateUserDto, LoginDto, UpdateUserDto } from '../types/user';
import { hashPassword, comparePassword, validatePassword } from '../utils/password';
import jwt from 'jsonwebtoken';

export class UserService {
  static async createUser(userData: CreateUserDto): Promise<{ user: PublicUser; token: string }> {
    // Validate password strength
    const passwordError = validatePassword(userData.password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email.toLowerCase())
      .single();

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: userData.email.toLowerCase(),
        password_hash: passwordHash,
        first_name: userData.first_name,
        last_name: userData.last_name
      })
      .select('id, email, first_name, last_name, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return { user, token };
  }

  static async loginUser(credentials: LoginDto): Promise<{ user: PublicUser; token: string }> {
    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email.toLowerCase())
      .single();

    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await comparePassword(credentials.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Return user without password hash
    const { password_hash, ...publicUser } = user;
    
    return { user: publicUser, token };
  }

  static async getUserById(userId: string): Promise<PublicUser | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, profile_image_url, created_at')
      .eq('id', userId)
      .single();

    if (error) return null;
    return user;
  }

  static async updateUser(userId: string, updates: UpdateUserDto): Promise<PublicUser> {
    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, first_name, last_name, profile_image_url, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return user;
  }
}
