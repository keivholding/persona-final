import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryClient';
import { getContexts, createContext, updateContext, deleteContext } from '../api/dashboardApi';
import { type UpdateContextRequest } from '../../../types/context';

// Query hook for fetching contexts
export const useContextsQuery = () => {
  return useQuery({
    queryKey: queryKeys.contexts,
    queryFn: getContexts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks for context operations
export const useCreateContextMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createContext,
    onSuccess: () => {
      // Invalidate and refetch contexts
      queryClient.invalidateQueries({ queryKey: queryKeys.contexts });
      // Also invalidate privacy matrix since contexts changed
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since context list changed
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
    onError: (error) => {
      console.error('Failed to create context:', error);
    },
  });
};

export const useUpdateContextMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contextId, updates }: { contextId: string; updates: UpdateContextRequest }) => 
      updateContext(contextId, updates),
    onSuccess: () => {
      // Invalidate and refetch contexts
      queryClient.invalidateQueries({ queryKey: queryKeys.contexts });
      // Also invalidate privacy matrix since context names/colors might have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since context details changed
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
    onError: (error) => {
      console.error('Failed to update context:', error);
    },
  });
};

export const useDeleteContextMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteContext,
    onSuccess: () => {
      // Invalidate and refetch contexts
      queryClient.invalidateQueries({ queryKey: queryKeys.contexts });
      // Also invalidate privacy matrix since a context was deleted
      queryClient.invalidateQueries({ queryKey: queryKeys.privacyMatrix });
      // Also invalidate identity requests since context was deleted
      queryClient.invalidateQueries({ queryKey: queryKeys.identityRequests });
    },
    onError: (error) => {
      console.error('Failed to delete context:', error);
    },
  });
};
