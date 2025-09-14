import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryClient';
import { getAttributes, createAttribute, updateAttribute, deleteAttribute } from '../api/attributesApi';
import { type UpdateAttributeRequest } from '../../../types/attribute';

// Query hook for fetching attributes
export const useAttributesQuery = () => {
  return useQuery({
    queryKey: queryKeys.attributes,
    queryFn: getAttributes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks for attribute operations
export const useCreateAttributeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAttribute,
    onSuccess: () => {
      // Invalidate and refetch attributes
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes });
      // Also invalidate privacy matrix since attributes changed
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since attribute list changed
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
    onError: (error) => {
      console.error('Failed to create attribute:', error);
    },
  });
};

export const useUpdateAttributeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ attributeId, updates }: { attributeId: string; updates: UpdateAttributeRequest }) => 
      updateAttribute(attributeId, updates),
    onSuccess: () => {
      // Invalidate and refetch attributes
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes });
      // Also invalidate privacy matrix since attribute names/values might have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since attribute details changed
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
    onError: (error) => {
      console.error('Failed to update attribute:', error);
    },
  });
};

export const useDeleteAttributeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      // Invalidate and refetch attributes
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes });
      // Also invalidate privacy matrix since an attribute was deleted
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since attribute was deleted
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
    onError: (error) => {
      console.error('Failed to delete attribute:', error);
    },
  });
};
