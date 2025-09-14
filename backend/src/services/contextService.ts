import { supabase } from './supabase';
import { Context, CreateContextDto, UpdateContextDto } from '../types/context';

export class ContextService {
  static async createContext(userId: string, contextData: CreateContextDto): Promise<Context> {
    const { data, error } = await supabase
      .from('contexts')
      .insert({
        user_id: userId,
        name: contextData.name,
        description: contextData.description,
        color: contextData.color || '#3B82F6'
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserContexts(userId: string): Promise<Context[]> {
    const { data, error } = await supabase
      .from('contexts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateContext(userId: string, contextId: string, updates: UpdateContextDto): Promise<Context> {
    const { data, error } = await supabase
      .from('contexts')
      .update(updates)
      .eq('id', contextId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteContext(userId: string, contextId: string): Promise<void> {
    const { error } = await supabase
      .from('contexts')
      .delete()
      .eq('id', contextId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}
