import "dotenv/config";
import { supabaseAdmin } from "./supabase";
import {
  Attribute,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from "../types/attribute";

class AttributeService {
  // Create a new attribute for a user
  async createAttribute(
    userId: string,
    attributeData: CreateAttributeRequest
  ): Promise<Attribute> {
    const { data, error } = await supabaseAdmin
      .from("attributes")
      .insert([
        {
          user_id: userId,
          name: attributeData.name,
          value: attributeData.value,
          type: attributeData.type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all attributes for a specific user
  async getAttributesByUserId(userId: string): Promise<Attribute[]> {
    const { data, error } = await supabaseAdmin
      .from("attributes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get a specific attribute by ID (with user ownership check)
  async getAttributeById(
    attributeId: string,
    userId: string
  ): Promise<Attribute | null> {
    const { data, error } = await supabaseAdmin
      .from("attributes")
      .select("*")
      .eq("id", attributeId)
      .eq("user_id", userId) // Ensure ownership
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows returned
      throw error;
    }
    return data;
  }

  // Update an attribute
  async updateAttribute(
    attributeId: string,
    userId: string,
    updates: UpdateAttributeRequest
  ): Promise<Attribute> {
    const { data, error } = await supabaseAdmin
      .from("attributes")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", attributeId)
      .eq("user_id", userId) // Ensure ownership
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete an attribute
  async deleteAttribute(attributeId: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("attributes")
      .delete()
      .eq("id", attributeId)
      .eq("user_id", userId); // Ensure ownership

    if (error) throw error;
  }

  // Get attributes by type for a user
  async getAttributesByType(
    userId: string,
    type: string
  ): Promise<Attribute[]> {
    const { data, error } = await supabaseAdmin
      .from("attributes")
      .select("*")
      .eq("user_id", userId)
      .eq("type", type)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }
}

export default new AttributeService();
