import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useContexts } from '../hooks/useContexts';
import { ContextGrid } from '../components/ContextGrid';
import type { Context } from '../types/context';

const ContextsPage = () => {
  const { user, logout } = useAuth();
  const { contexts, loading, error, createContext, updateContext, deleteContext } = useContexts();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContext, setEditingContext] = useState<Context | null>(null);

  const handleCreateContext = async (data: any) => {
    try {
      await createContext(data);
      setShowCreateModal(false);
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to create context:', error);
    }
  };

  const handleEditContext = (context: Context) => {
    setEditingContext(context);
  };

  const handleUpdateContext = async (data: any) => {
    if (!editingContext) return;
    
    try {
      await updateContext(editingContext.id, data);
      setEditingContext(null);
    } catch (error) {
      console.error('Failed to update context:', error);
    }
  };

  const handleSetDefault = async (contextId: string) => {
    try {
      await updateContext(contextId, { is_default: true });
    } catch (error) {
      console.error('Failed to set default context:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Persona.io
              </h1>
              <nav className="ml-8 flex space-x-8">
                <a href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
                <a href="/contexts" className="bg-gray-100 text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Contexts
                </a>
                <a href="/attributes" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Attributes
                </a>
                <a href="/privacy" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Privacy Matrix
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.first_name || user?.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Contexts</h1>
              <p className="mt-2 text-gray-600">
                Manage your different persona contexts. Each context represents a different aspect of your identity.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Context
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contexts grid */}
        <ContextGrid
          contexts={contexts}
          loading={loading}
          onEdit={handleEditContext}
          onDelete={deleteContext}
          onSetDefault={handleSetDefault}
          onCreateNew={() => setShowCreateModal(true)}
        />

        {/* TODO: Add create/edit modals */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Context</h2>
              <p className="text-gray-600 mb-4">Modal coming soon...</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement create functionality
                    setShowCreateModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContextsPage;
