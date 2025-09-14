import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryClient';
import { getPrivacyMatrix, assignAttributeToContext, removeAttributeFromContext } from '../api/privacyMatrixApi';
import { type PrivacyMatrixData } from '../../../types/privacyMatrix';

// Query hook for fetching privacy matrix
export const usePrivacyMatrixQuery = () => {
  return useQuery({
    queryKey: queryKeys.privacyMatrix,
    queryFn: getPrivacyMatrix,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hook for assigning attribute to context
export const useAssignAttributeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: assignAttributeToContext,
    onSuccess: () => {
      // Invalidate privacy matrix to refetch the latest state
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since they show which attributes will be shared
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
    onError: (error) => {
      console.error('Failed to assign attribute to context:', error);
    },
  });
};

// Mutation hook for removing attribute from context
export const useRemoveAttributeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contextId, attributeId }: { contextId: string; attributeId: string }) => 
      removeAttributeFromContext(contextId, attributeId),
    onSuccess: () => {
      // Invalidate privacy matrix to refetch the latest state
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since they show which attributes will be shared
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
    onError: (error) => {
      console.error('Failed to remove attribute from context:', error);
    },
  });
};

// Combined toggle mutation with optimistic updates
export const useToggleAttributeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      attributeId, 
      contextId, 
      isCurrentlyAssigned 
    }: { 
      attributeId: string; 
      contextId: string; 
      isCurrentlyAssigned: boolean;
    }) => {
      if (isCurrentlyAssigned) {
        await removeAttributeFromContext(contextId, attributeId);
      } else {
        await assignAttributeToContext({ context_id: contextId, attribute_id: attributeId });
      }
    },
    onMutate: async ({ attributeId, contextId, isCurrentlyAssigned }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.privacyMatrix });

      // Snapshot the previous value
      const previousMatrix = queryClient.getQueryData(queryKeys.privacyMatrix);

      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.privacyMatrix, (old: PrivacyMatrixData | undefined) => {
        if (!old) return old;
        
        return {
          ...old,
          matrix: old.matrix.map((row) => {
            if (row.attribute.id === attributeId) {
              return {
                ...row,
                contexts: {
                  ...row.contexts,
                  [contextId]: !isCurrentlyAssigned
                }
              };
            }
            return row;
          })
        };
      });

      // Return a context object with the snapshotted value
      return { previousMatrix };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMatrix) {
        queryClient.setQueryData(queryKeys.privacyMatrix, context.previousMatrix);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since they show which attributes will be shared
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
  });
};
