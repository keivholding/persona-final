import { useState } from "react";
import { useAttributesQuery, useCreateAttributeMutation, useUpdateAttributeMutation, useDeleteAttributeMutation } from "../hooks/useAttributesQuery";
import CreateAttributeModal from "./CreateAttributeModal";
import EditAttributeModal from "./EditAttributeModal";
import DeleteAttributeModal from "./DeleteAttributeModal";
import AttributeDropdown from "./AttributeDropdown";
import { type Attribute, type AttributeType, type CreateAttributeRequest } from "../../../types/attribute";

// Helper function to get icon for attribute type
const getAttributeIcon = (type: AttributeType) => {
  switch (type) {
    case 'email':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      );
    case 'phone':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    case 'url':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    case 'image':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'date':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'address':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default: // text
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
};

// Helper function to get color for attribute type
const getAttributeColor = (type: AttributeType) => {
  switch (type) {
    case 'email':
      return 'from-blue-500 to-blue-600';
    case 'phone':
      return 'from-green-500 to-green-600';
    case 'url':
      return 'from-purple-500 to-purple-600';
    case 'image':
      return 'from-pink-500 to-pink-600';
    case 'date':
      return 'from-orange-500 to-orange-600';
    case 'address':
      return 'from-red-500 to-red-600';
    default: // text
      return 'from-gray-500 to-gray-600';
  }
};

// Helper function to format attribute value for display
const formatAttributeValue = (attribute: Attribute) => {
  if (attribute.type === 'image') {
    if (attribute.value.startsWith('http')) {
      return (
        <div className="space-y-2">
          <img
            src={attribute.value}
            alt={attribute.name}
            className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="text-gray-500 text-sm p-4 bg-gray-100 rounded-lg">🖼️ Image failed to load</div>`;
              }
            }}
          />
          <p className="text-xs text-gray-500 truncate">{attribute.value}</p>
        </div>
      );
    } else {
      return (
        <div className="text-gray-500 text-sm p-4 bg-gray-100 rounded-lg">
          🖼️ {attribute.value}
        </div>
      );
    }
  }

  if (attribute.type === 'url' && attribute.value.startsWith('http')) {
    return (
      <a 
        href={attribute.value} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-700 underline"
      >
        {attribute.value}
      </a>
    );
  }
  
  if (attribute.type === 'email') {
    return (
      <a 
        href={`mailto:${attribute.value}`}
        className="text-indigo-600 hover:text-indigo-700 underline"
      >
        {attribute.value}
      </a>
    );
  }

  if (attribute.type === 'phone') {
    return (
      <a 
        href={`tel:${attribute.value}`}
        className="text-indigo-600 hover:text-indigo-700 underline"
      >
        {attribute.value}
      </a>
    );
  }

  if (attribute.type === 'address') {
    return (
      <a 
        href={`https://maps.google.com/?q=${encodeURIComponent(attribute.value)}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-700 underline"
      >
        {attribute.value}
      </a>
    );
  }

  return attribute.value;
};

const AttributeGrid = () => {
  const { data: attributes, isLoading, error } = useAttributesQuery();
  const createAttributeMutation = useCreateAttributeMutation();
  const updateAttributeMutation = useUpdateAttributeMutation();
  const deleteAttributeMutation = useDeleteAttributeMutation();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);

  const handleEdit = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
    setIsEditModalOpen(true);
  };

  const handleDelete = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
    setIsDeleteModalOpen(true);
  };

  const handleCreateAttribute = async (attributeData: CreateAttributeRequest) => {
    return await createAttributeMutation.mutateAsync(attributeData);
  };

  const handleUpdateAttribute = async (attributeId: string, updates: CreateAttributeRequest) => {
    return await updateAttributeMutation.mutateAsync({ attributeId, updates });
  };

  const handleDeleteAttribute = async (attributeId: string) => {
    await deleteAttributeMutation.mutateAsync(attributeId);
  };

  if (isLoading) {
    return (
      <section className="space-y-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Attributes</h2>
              <p className="text-sm text-gray-600 mt-1">The building blocks of your digital identity</p>
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
              New Attribute
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading attributes...</p>
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Attributes</h2>
              <p className="text-sm text-gray-600 mt-1">The building blocks of your digital identity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Attribute
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load attributes</p>
            <p className="text-gray-500 text-sm">{error?.message || 'Unknown error'}</p>
          </div>
        </div>
        
        <CreateAttributeModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAttribute}
        />
      </section>
    );
  }

  // Empty state
  if (!attributes || attributes.length === 0) {
    return (
      <section className="space-y-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Attributes</h2>
              <p className="text-sm text-gray-600 mt-1">The building blocks of your digital identity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Attribute
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-center">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create your first attribute</h3>
            <p className="text-gray-500 mb-4">Attributes are the building blocks of your digital identity.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
            >
              + Create Attribute
            </button>
          </div>
        </div>

        <CreateAttributeModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAttribute}
        />
      </section>
    );
  }

  // Show attributes
  return (
    <section className="space-y-8">
      {/* Enhanced Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Attributes</h2>
            <p className="text-sm text-gray-600 mt-1">The building blocks of your digital identity</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm text-gray-600">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            {attributes?.length || 0} Attributes
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Attribute
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {attributes.map((attribute) => (
          <div key={attribute.id} className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
            <div className={`flex items-start justify-between rounded-t-xl bg-gradient-to-br ${getAttributeColor(attribute.type)} p-4 text-white`}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 backdrop-blur-sm">
                  {getAttributeIcon(attribute.type)}
                </div>
                <div>
                  <div className="font-semibold">{attribute.name}</div>
                  <div className="text-xs text-white/80 uppercase tracking-wide">{attribute.type}</div>
                </div>
              </div>
              <AttributeDropdown 
                attribute={attribute}
                onEdit={() => handleEdit(attribute)}
                onDelete={() => handleDelete(attribute)}
              />
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-900 font-medium break-words">
                {formatAttributeValue(attribute)}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Created {new Date(attribute.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateAttributeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAttribute}
      />
      
      <EditAttributeModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAttribute(null);
        }}
        onSubmit={handleUpdateAttribute}
        attribute={selectedAttribute}
      />
      
      <DeleteAttributeModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAttribute(null);
        }}
        onConfirm={handleDeleteAttribute}
        attribute={selectedAttribute}
      />
    </section>
  );
};

export default AttributeGrid;
