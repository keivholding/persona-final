import { supabase } from './supabase';
import { PrivacyMatrix, UpdateVisibilityDto } from '../types/contextAttribute';

export class ContextAttributeService {
  static async getPrivacyMatrix(userId: string): Promise<PrivacyMatrix> {
    // Get user's contexts
    const { data: contexts, error: contextError } = await supabase
      .from('contexts')
      .select('id, name, color')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });

    if (contextError) throw new Error(`Failed to fetch contexts: ${contextError.message}`);

    // Get user's attributes
    const { data: attributes, error: attributeError } = await supabase
      .from('attributes')
      .select('id, name, type, value')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (attributeError) throw new Error(`Failed to fetch attributes: ${attributeError.message}`);

    // Get visibility mappings
    const { data: visibility, error: visibilityError } = await supabase
      .from('context_attributes')
      .select('context_id, attribute_id')
      .eq('user_id', userId);

    if (visibilityError) throw new Error(`Failed to fetch visibility: ${visibilityError.message}`);

    // Build visibility map
    const visibilityMap = new Set();
    (visibility || []).forEach(v => {
      visibilityMap.add(`${v.context_id}:${v.attribute_id}`);
    });

    // Build matrix
    const matrix = (attributes || []).map(attribute => ({
      attribute,
      contexts: (contexts || []).reduce((acc, context) => {
        acc[context.id] = visibilityMap.has(`${context.id}:${attribute.id}`);
        return acc;
      }, {} as Record<string, boolean>)
    }));

    return {
      contexts: contexts || [],
      matrix
    };
  }

  static async updateVisibility(userId: string, data: UpdateVisibilityDto): Promise<void> {
    const { context_id, attribute_id, visible } = data;

    if (visible) {
      // Add visibility
      const { error } = await supabase
        .from('context_attributes')
        .insert({
          user_id: userId,
          context_id,
          attribute_id
        });

      if (error && !error.message.includes('duplicate')) {
        throw new Error(`Failed to add visibility: ${error.message}`);
      }
    } else {
      // Remove visibility
      const { error } = await supabase
        .from('context_attributes')
        .delete()
        .eq('user_id', userId)
        .eq('context_id', context_id)
        .eq('attribute_id', attribute_id);

      if (error) {
        throw new Error(`Failed to remove visibility: ${error.message}`);
      }
    }
  }

  static async bulkUpdateVisibility(
    userId: string, 
    updates: UpdateVisibilityDto[]
  ): Promise<void> {
    const promises = updates.map(update => 
      this.updateVisibility(userId, update)
    );

    await Promise.all(promises);
  }

  static async getContextProfile(userId: string, contextId: string): Promise<any> {
    const { data: context } = await supabase
      .from('contexts')
      .select('*')
      .eq('id', contextId)
      .eq('user_id', userId)
      .single();

    if (!context) throw new Error('Context not found');

    const { data: attributes } = await supabase
      .from('attributes')
      .select(`
        id, name, type, value,
        context_attributes!inner(*)
      `)
      .eq('user_id', userId)
      .eq('context_attributes.context_id', contextId);

    return {
      context,
      attributes: attributes || []
    };
  }
}
