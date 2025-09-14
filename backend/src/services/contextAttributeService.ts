import "dotenv/config";
import { supabaseAdmin } from "./supabase";
import {
  ContextAttribute,
  CreateContextAttributeRequest,
  PrivacyMatrixResponse,
} from "../types/contextAttribute";
import { Attribute } from "../types/attribute";
import { Context } from "../types/context";

class ContextAttributeService {
  // Get the privacy matrix for a user (all attributes vs all contexts)
  async getPrivacyMatrix(userId: string): Promise<PrivacyMatrixResponse> {
    // Get all user's attributes
    const { data: attributes, error: attributesError } = await supabaseAdmin
      .from("attributes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (attributesError) throw attributesError;

    // Get all user's contexts
    const { data: contexts, error: contextsError } = await supabaseAdmin
      .from("contexts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (contextsError) throw contextsError;

    // Get all context-attribute relationships for this user
    const { data: relationships, error: relationshipsError } =
      await supabaseAdmin
        .from("context_attributes")
        .select("context_id, attribute_id")
        .eq("user_id", userId);

    if (relationshipsError) throw relationshipsError;

    // Build the matrix
    const matrix = attributes.map((attribute: Attribute) => {
      const contextAssignments: { [contextId: string]: boolean } = {};

      contexts.forEach((context: Context) => {
        // Check if this attribute is assigned to this context
        const isAssigned = relationships.some(
          (rel) =>
            rel.context_id === context.id && rel.attribute_id === attribute.id
        );
        contextAssignments[context.id] = isAssigned;
      });

      return {
        attribute: {
          id: attribute.id,
          name: attribute.name,
          value: attribute.value,
          type: attribute.type,
        },
        contexts: contextAssignments,
      };
    });

    return {
      attributes,
      contexts,
      matrix,
    };
  }

  // Assign an attribute to a context
  async assignAttributeToContext(
    userId: string,
    data: CreateContextAttributeRequest
  ): Promise<ContextAttribute> {
    // Convert IDs to strings to ensure consistency
    const contextId = String(data.context_id);
    const attributeId = String(data.attribute_id);

    // Verify both context and attribute belong to the user
    const [contextCheck, attributeCheck] = await Promise.all([
      supabaseAdmin
        .from("contexts")
        .select("id")
        .eq("id", contextId)
        .eq("user_id", userId)
        .single(),
      supabaseAdmin
        .from("attributes")
        .select("id")
        .eq("id", attributeId)
        .eq("user_id", userId)
        .single(),
    ]);

    if (contextCheck.error || attributeCheck.error) {
      throw new Error("Context or attribute not found or unauthorized");
    }

    // Create the assignment
    const { data: assignment, error } = await supabaseAdmin
      .from("context_attributes")
      .insert([
        {
          context_id: contextId,
          attribute_id: attributeId,
          user_id: userId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation gracefully
      if (error.code === "23505") {
        throw new Error("Attribute is already assigned to this context");
      }
      throw error;
    }

    return assignment;
  }

  // Remove an attribute from a context
  async removeAttributeFromContext(
    userId: string,
    contextId: string,
    attributeId: string
  ): Promise<void> {
    // Convert IDs to strings to ensure consistency
    const contextIdStr = String(contextId);
    const attributeIdStr = String(attributeId);

    const { error } = await supabaseAdmin
      .from("context_attributes")
      .delete()
      .eq("context_id", contextIdStr)
      .eq("attribute_id", attributeIdStr)
      .eq("user_id", userId); // Ensure user owns the assignment

    if (error) throw error;
  }

  // Get all attributes for a specific context
  async getAttributesForContext(
    userId: string,
    contextId: string
  ): Promise<Attribute[]> {
    const { data, error } = await supabaseAdmin
      .from("context_attributes")
      .select(
        `
        attributes (
          id,
          name,
          value,
          type,
          created_at,
          updated_at
        )
      `
      )
      .eq("context_id", contextId)
      .eq("user_id", userId);

    if (error) throw error;

    // Extract the attributes from the joined data
    return data.map((item: any) => ({
      ...item.attributes,
      user_id: userId,
    }));
  }

  // Get all contexts that contain a specific attribute
  async getContextsForAttribute(
    userId: string,
    attributeId: string
  ): Promise<Context[]> {
    const { data, error } = await supabaseAdmin
      .from("context_attributes")
      .select(
        `
        contexts (
          id,
          name,
          description,
          color,
          created_at,
          updated_at
        )
      `
      )
      .eq("attribute_id", attributeId)
      .eq("user_id", userId);

    if (error) throw error;

    // Extract the contexts from the joined data
    return data.map((item: any) => ({
      ...item.contexts,
      user_id: userId,
    }));
  }
}

export default new ContextAttributeService();
