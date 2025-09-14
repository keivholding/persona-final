import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { identityRequestsApi } from '../../../lib/api/identityRequests';
import type { 
  RespondToRequestRequest
} from '../../../types/identityRequest';

// Query keys
const QUERY_KEYS = {
  identityRequests: ['identity-requests'] as const,
  received: () => [...QUERY_KEYS.identityRequests, 'received'] as const,
  sent: () => [...QUERY_KEYS.identityRequests, 'sent'] as const,
  pendingCount: () => [...QUERY_KEYS.identityRequests, 'pending-count'] as const,
  detail: (id: string) => [...QUERY_KEYS.identityRequests, 'detail', id] as const,
};

// Get received requests
export const useReceivedRequestsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.received(),
    queryFn: identityRequestsApi.getReceivedRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get sent requests
export const useSentRequestsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.sent(),
    queryFn: identityRequestsApi.getSentRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get pending count
export const usePendingCountQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.pendingCount(),
    queryFn: identityRequestsApi.getPendingCount,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get specific request
export const useRequestQuery = (requestId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(requestId),
    queryFn: () => identityRequestsApi.getRequest(requestId),
    enabled: !!requestId,
  });
};

// Create request mutation
export const useCreateRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: identityRequestsApi.createRequest,
    onSuccess: () => {
      // Invalidate and refetch sent requests
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sent() });
      // Also invalidate the target user's received requests (if we had that info)
    },
    onError: (error: Error) => {
      console.error('Failed to create request:', error);
    },
  });
};

// Respond to request mutation (approve/deny)
export const useRespondToRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, response }: { requestId: string; response: RespondToRequestRequest }) =>
      identityRequestsApi.respondToRequest(requestId, response),
    onSuccess: (updatedRequest) => {
      // Update the specific request in cache
      queryClient.setQueryData(
        QUERY_KEYS.detail(updatedRequest.id.toString()),
        updatedRequest
      );

      // Invalidate and refetch received requests
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.received() });
      
      // Invalidate sent requests (for the requestor's view)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sent() });
      
      // Invalidate pending count
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingCount() });
    },
    onError: (error: Error) => {
      console.error('Failed to respond to request:', error);
    },
  });
};

// Revoke request mutation
export const useRevokeRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: identityRequestsApi.revokeRequest,
    onSuccess: (updatedRequest) => {
      // Update the specific request in cache
      queryClient.setQueryData(
        QUERY_KEYS.detail(updatedRequest.id.toString()),
        updatedRequest
      );

      // Invalidate both sent and received (either party can revoke)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.received() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sent() });
    },
    onError: (error: Error) => {
      console.error('Failed to revoke request:', error);
    },
  });
};

// Delete request mutation
export const useDeleteRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: identityRequestsApi.deleteRequest,
    onSuccess: (_, requestId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(requestId) });

      // Invalidate sent requests (only requestor can delete)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sent() });
    },
    onError: (error: Error) => {
      console.error('Failed to delete request:', error);
    },
  });
};
