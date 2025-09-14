import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false, 
      retry: (failureCount, error) => {
        
        const errorWithStatus = error as Error & { status?: number };
        if (error instanceof Error && 'status' in error && typeof errorWithStatus.status === 'number' && errorWithStatus.status >= 400 && errorWithStatus.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    },
    mutations: {
      retry: false,
    },
  },
});

// Query Keys
export const queryKeys = {
  contexts: ['contexts'] as const,
  attributes: ['attributes'] as const,
  privacyMatrix: ['privacy-matrix'] as const,
  identityRequests: ['identity-requests'] as const,
  contextAttributes: (contextId: string) => ['context-attributes', contextId] as const,
  attributeContexts: (attributeId: string) => ['attribute-contexts', attributeId] as const,
} as const;
