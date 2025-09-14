import { useMemo } from 'react';
import { usePrivacyMatrixQuery } from './usePrivacyMatrixQuery';
import { useContextsQuery } from './useContextsQuery';
import { type Attribute, type AttributeType } from '../../../types/attribute';
import { type Context } from '../../../types/context';

export interface ProfileData {
  context: Context;
  attributes: Attribute[];
  isLoading: boolean;
  error: string | null;
}

export const useProfilePreview = (contextId: string): ProfileData => {
  const { data: matrixData, isLoading: matrixLoading, error: matrixError } = usePrivacyMatrixQuery();
  const { data: contexts, isLoading: contextsLoading, error: contextsError } = useContextsQuery();

  const isLoading = matrixLoading || contextsLoading;
  const error = matrixError?.message || contextsError?.message || null;

  const profileData = useMemo((): ProfileData => {
    const defaultData: ProfileData = {
      context: {} as Context,
      attributes: [],
      isLoading,
      error
    };

    if (!matrixData || !contexts || !contextId) {
      return defaultData;
    }

    // Find the selected context (ensure both IDs are strings for comparison)
    const selectedContext = contexts.find(ctx => String(ctx.id) === String(contextId));

    if (!selectedContext) {
      return {
        ...defaultData,
        error: 'Context not found'
      };
    }

    // Get attributes that are visible in this context
    const visibleAttributes: Attribute[] = [];
    
    if (matrixData.matrix) {
      matrixData.matrix.forEach(row => {
        // If this attribute is enabled for the selected context (ensure string comparison)
        const isVisible = row.contexts[String(contextId)] === true;

        if (isVisible) {
          // Convert the matrix row attribute to full Attribute type
          const fullAttribute: Attribute = {
            ...row.attribute,
            user_id: '', // These fields aren't needed for display
            created_at: '',
            updated_at: '',
            type: row.attribute.type as AttributeType
          };
          visibleAttributes.push(fullAttribute);
        }
      });
    }

    return {
      context: selectedContext,
      attributes: visibleAttributes,
      isLoading: false,
      error: null
    };
  }, [matrixData, contexts, contextId, isLoading, error]);

  return profileData;
};

// Utility functions for attribute validation and rendering
export const validateAttributeValue = (value: string, type: string): boolean => {
  switch (type) {
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    
    case 'url': {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }
    
    case 'phone': {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-()]/g, ''));
    }
    
    case 'date': {
      return !isNaN(Date.parse(value));
    }
    
    default: {
      return value.trim().length > 0;
    }
  }
};

export const formatAttributeValue = (value: string, type: string): string => {
  switch (type) {
    case 'phone': {
      // Basic phone formatting (can be enhanced)
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      return value;
    }
    
    case 'date': {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    default: {
      return value;
    }
  }
};
