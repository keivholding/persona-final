import React from 'react';
import type { Context } from '../types/context';
import { ContextCard } from './ContextCard';

interface ContextGridProps {
  contexts: Context[];
  loading: boolean;
  onEdit: (context: Context) => void;
  onDelete: (contextId: string) => void;
  onSetDefault: (contextId: string) => void;
  onCreateNew: () => void;
}

export const ContextGrid: React.FC<ContextGridProps> = ({
  contexts,
  loading,
  onEdit,
  onDelete,
  onSetDefault,
  onCreateNew
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-gray-200" />
              <div className="h-5 bg-gray-200 rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contexts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No contexts yet</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Create your first context to start organizing your digital identity. 
          Each context represents a different aspect of your online presence.
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create First Context
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contexts.map((context) => (
        <ContextCard
          key={context.id}
          context={context}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
      
      {/* Add new context card */}
      <div 
        onClick={onCreateNew}
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer border-dashed hover:border-blue-300 hover:bg-blue-50/30"
      >
        <div className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Add New Context</h3>
          <p className="text-sm text-gray-500">
            Create another persona context
          </p>
        </div>
      </div>
    </div>
  );
};
