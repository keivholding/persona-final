import { useState } from "react";
import { LayersIcon } from "../../../app/ui/icons";
import { useContextsQuery, useCreateContextMutation, useUpdateContextMutation, useDeleteContextMutation } from "../hooks/useContextsQuery";
import { usePrivacyMatrixQuery } from "../hooks/usePrivacyMatrixQuery";
import CreateContextModal from "./CreateContextModal";
import EditContextModal from "./EditContextModal";
import DeleteContextModal from "./DeleteContextModal";
import ContextCard from "./ContextCard";
import { type Context, type CreateContextRequest } from "../../../types/context";

// Helper function to convert hex color to Tailwind gradient classes
const getColorGradient = (hexColor: string) => {
  const colorMap: Record<string, string> = {
    "#6366f1": "from-indigo-500 to-blue-600",
    "#10b981": "from-emerald-500 to-teal-600", 
    "#f59e0b": "from-amber-500 to-orange-600",
    "#ef4444": "from-red-500 to-red-600",
    "#8b5cf6": "from-violet-500 to-purple-600",
    "#06b6d4": "from-cyan-500 to-blue-600",
    "#84cc16": "from-lime-500 to-green-600",
    "#f97316": "from-orange-500 to-red-600",
  };
  
  return colorMap[hexColor] || "from-gray-500 to-gray-600";
};

const ContextGrid = () => {
  const { data: contexts, isLoading, error } = useContextsQuery();
  const { data: matrixData } = usePrivacyMatrixQuery();
  const createContextMutation = useCreateContextMutation();
  const updateContextMutation = useUpdateContextMutation();
  const deleteContextMutation = useDeleteContextMutation();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);

  const handleEdit = (context: Context) => {
    setSelectedContext(context);
    setIsEditModalOpen(true);
  };

  const handleDelete = (context: Context) => {
    setSelectedContext(context);
    setIsDeleteModalOpen(true);
  };

  const handleCreateContext = async (contextData: CreateContextRequest) => {
    return await createContextMutation.mutateAsync(contextData);
  };

  const handleUpdateContext = async (contextId: string, updates: CreateContextRequest) => {
    return await updateContextMutation.mutateAsync({ contextId, updates });
  };

  const handleDeleteContext = async (contextId: string) => {
    await deleteContextMutation.mutateAsync(contextId);
  };

  if (isLoading) {
    return (
      <section className="space-y-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <LayersIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Contexts</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your digital personas across different environments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled
              className="inline-flex items-center gap-2 rounded-xl bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Context
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading contexts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <LayersIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Contexts</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your digital personas across different environments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Context
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load contexts</p>
            <p className="text-gray-500 text-sm">{error?.message || 'Unknown error'}</p>
          </div>
        </div>
        
        <CreateContextModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateContext}
        />
      </section>
    );
  }

  // Empty state
  if (!contexts || contexts.length === 0) {
    return (
      <section className="space-y-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <LayersIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Contexts</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your digital personas across different environments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Context
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-center">
            <LayersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create your first context</h3>
            <p className="text-gray-500 mb-4">Contexts help you manage different aspects of your digital identity.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
            >
              + Create Context
            </button>
          </div>
        </div>

        <CreateContextModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateContext}
        />
      </section>
    );
  }

  // Show contexts
  return (
    <section className="space-y-8">
      {/* Enhanced Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <LayersIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Contexts</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your digital personas across different environments</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm text-gray-600">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            {contexts?.length || 0} Active
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Context
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {contexts.map((context) => (
          <ContextCard
            key={context.id}
            context={context}
            matrixData={matrixData || null}
            onEdit={handleEdit}
            onDelete={handleDelete}
            gradient={getColorGradient(context.color)}
          />
        ))}
      </div>

      <CreateContextModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateContext}
      />
      
      <EditContextModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedContext(null);
        }}
        onSubmit={handleUpdateContext}
        context={selectedContext}
      />
      
      <DeleteContextModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedContext(null);
        }}
        onConfirm={handleDeleteContext}
        context={selectedContext}
      />
    </section>
  );
};

export default ContextGrid;

