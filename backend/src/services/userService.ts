import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from './supabase';
import { User, CreateUserDto, LoginDto } from '../types/user';

export class UserService {
  static async createUser(userData: CreateUserDto): Promise<{ user: User; token: string }> {
    const existingUser = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single();

    if (existingUser.data) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        password_hash: hashedPassword
      })
      .select('*')
      .single();

    if (error) throw error;

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    
    return { user, token };
  }

  static async loginUser(credentials: LoginDto): Promise<{ user: User; token: string }> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    
    return { user, token };
  }
}
