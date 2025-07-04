import { supabase } from './supabase';
import { Attribute, CreateAttributeDto, UpdateAttributeDto, AttributeType } from '../types/attribute';

export class AttributeService {
  static async createAttribute(userId: string, attributeData: CreateAttributeDto): Promise<Attribute> {
    // Validate attribute name
    if (!attributeData.name || attributeData.name.trim().length === 0) {
      throw new Error('Attribute name is required');
    }

    if (!attributeData.value || attributeData.value.trim().length === 0) {
      throw new Error('Attribute value is required');
    }

    // Check for duplicate names
    const { data: existing } = await supabase
      .from('attributes')
      .select('id')
      .eq('user_id', userId)
      .eq('name', attributeData.name.trim())
      .single();

    if (existing) {
      throw new Error('An attribute with this name already exists');
    }

    // Validate value based on type
    this.validateAttributeValue(attributeData.type, attributeData.value);

    const { data, error } = await supabase
      .from('attributes')
      .insert({
        user_id: userId,
        name: attributeData.name.trim(),
        value: attributeData.value.trim(),
        type: attributeData.type
      })
      .select('*')
      .single();

    if (error) throw new Error(`Failed to create attribute: ${error.message}`);
    return data;
  }

  static async getUserAttributes(userId: string): Promise<Attribute[]> {
    const { data, error } = await supabase
      .from('attributes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to fetch attributes: ${error.message}`);
    return data || [];
  }

  static async getAttributeById(userId: string, attributeId: string): Promise<Attribute | null> {
    const { data, error } = await supabase
      .from('attributes')
      .select('*')
      .eq('id', attributeId)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  static async updateAttribute(
    userId: string, 
    attributeId: string, 
    updates: UpdateAttributeDto
  ): Promise<Attribute> {
    if (updates.value) {
      const attribute = await this.getAttributeById(userId, attributeId);
      if (attribute && updates.type) {
        this.validateAttributeValue(updates.type, updates.value);
      }
    }

    const { data, error } = await supabase
      .from('attributes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', attributeId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to update attribute: ${error.message}`);
    return data;
  }

  static async deleteAttribute(userId: string, attributeId: string): Promise<void> {
    const { error } = await supabase
      .from('attributes')
      .delete()
      .eq('id', attributeId)
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to delete attribute: ${error.message}`);
  }

  private static validateAttributeValue(type: AttributeType, value: string): void {
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error('Invalid email format');
        }
        break;
      
      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
          throw new Error('Invalid phone number format');
        }
        break;
      
      case 'url':
        try {
          new URL(value);
        } catch {
          throw new Error('Invalid URL format');
        }
        break;
      
      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        break;
    }
  }
}
