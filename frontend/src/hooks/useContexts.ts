import { useState, useEffect } from 'react';
import type { Context, CreateContextRequest, UpdateContextRequest } from '../types/context';
import { contextApi } from '../lib/api/contexts';

export const useContexts = () => {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContexts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contextApi.getContexts();
      setContexts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contexts');
      console.error('Error fetching contexts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createContext = async (data: CreateContextRequest): Promise<Context> => {
    try {
      const newContext = await contextApi.createContext(data);
      setContexts(prev => [...prev, newContext]);
      return newContext;
    } catch (err: any) {
      setError(err.message || 'Failed to create context');
      throw err;
    }
  };

  const updateContext = async (id: string, data: UpdateContextRequest): Promise<Context> => {
    try {
      const updatedContext = await contextApi.updateContext(id, data);
      setContexts(prev => prev.map(ctx => ctx.id === id ? updatedContext : ctx));
      return updatedContext;
    } catch (err: any) {
      setError(err.message || 'Failed to update context');
      throw err;
    }
  };

  const deleteContext = async (id: string): Promise<void> => {
    try {
      await contextApi.deleteContext(id);
      setContexts(prev => prev.filter(ctx => ctx.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete context');
      throw err;
    }
  };

  useEffect(() => {
    fetchContexts();
  }, []);

  return {
    contexts,
    loading,
    error,
    refetch: fetchContexts,
    createContext,
    updateContext,
    deleteContext
  };
};
