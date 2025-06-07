import { supabase } from './supabase';
import { Context, CreateContextDto, UpdateContextDto } from '../types/context';

export class ContextService {
  static async createContext(userId: string, contextData: CreateContextDto): Promise<Context> {
    // Validate context name
    if (!contextData.name || contextData.name.trim().length === 0) {
      throw new Error('Context name is required');
    }

    // Check for duplicate names
    const { data: existing } = await supabase
      .from('contexts')
      .select('id')
      .eq('user_id', userId)
      .eq('name', contextData.name.trim())
      .single();

    if (existing) {
      throw new Error('A context with this name already exists');
    }

    // If this is marked as default, unset other defaults
    if (contextData.is_default) {
      await supabase
        .from('contexts')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('contexts')
      .insert({
        user_id: userId,
        name: contextData.name.trim(),
        description: contextData.description?.trim(),
        color: contextData.color || '#3B82F6',
        is_default: contextData.is_default || false
      })
      .select('*')
      .single();

    if (error) throw new Error(`Failed to create context: ${error.message}`);
    return data;
  }

  static async getUserContexts(userId: string): Promise<Context[]> {
    const { data, error } = await supabase
      .from('contexts')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to fetch contexts: ${error.message}`);
    return data || [];
  }

  static async getContextById(userId: string, contextId: string): Promise<Context | null> {
    const { data, error } = await supabase
      .from('contexts')
      .select('*')
      .eq('id', contextId)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  static async updateContext(
    userId: string, 
    contextId: string, 
    updates: UpdateContextDto
  ): Promise<Context> {
    // If setting as default, unset other defaults first
    if (updates.is_default) {
      await supabase
        .from('contexts')
        .update({ is_default: false })
        .eq('user_id', userId)
        .neq('id', contextId);
    }

    const { data, error } = await supabase
      .from('contexts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', contextId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to update context: ${error.message}`);
    return data;
  }

  static async deleteContext(userId: string, contextId: string): Promise<void> {
    // Check if this is the user's only context
    const { data: contexts } = await supabase
      .from('contexts')
      .select('id')
      .eq('user_id', userId);

    if (contexts && contexts.length <= 1) {
      throw new Error('Cannot delete your only context');
    }

    const { error } = await supabase
      .from('contexts')
      .delete()
      .eq('id', contextId)
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to delete context: ${error.message}`);
  }

  static async getContextStats(userId: string): Promise<any> {
    const { data: contexts } = await supabase
      .from('contexts')
      .select('id')
      .eq('user_id', userId);

    const { data: attributes } = await supabase
      .from('attributes')
      .select('id')
      .eq('user_id', userId);

    const { data: contextAttributes } = await supabase
      .from('context_attributes')
      .select('*')
      .eq('user_id', userId);

    const totalContexts = contexts?.length || 0;
    const totalAttributes = attributes?.length || 0;
    const totalAssociations = contextAttributes?.length || 0;

    const maxPossibleAssociations = totalContexts * totalAttributes;
    const visibilityCoverage = maxPossibleAssociations > 0 
      ? (totalAssociations / maxPossibleAssociations) * 100 
      : 0;

    return {
      total_contexts: totalContexts,
      total_attributes: totalAttributes,
      total_associations: totalAssociations,
      visibility_coverage: Math.round(visibilityCoverage)
    };
  }
}
