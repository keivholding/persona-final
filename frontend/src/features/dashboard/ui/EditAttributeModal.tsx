import { useState, useEffect } from "react";
import { type CreateAttributeRequest, type Attribute, type AttributeType } from "../../../types/attribute";

interface EditAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attributeId: string, updates: CreateAttributeRequest) => Promise<Attribute>;
  attribute: Attribute | null;
}

const attributeTypes: { value: AttributeType; label: string; description: string }[] = [
  { value: 'text', label: 'Text', description: 'General text information' },
  { value: 'email', label: 'Email', description: 'Email addresses' },
  { value: 'phone', label: 'Phone', description: 'Phone numbers' },
  { value: 'url', label: 'URL', description: 'Website links' },
  { value: 'image', label: 'Image', description: 'Image URLs' },
  { value: 'date', label: 'Date', description: 'Dates and timestamps' },
  { value: 'address', label: 'Address', description: 'Physical addresses' },
];

const EditAttributeModal = ({ isOpen, onClose, onSubmit, attribute }: EditAttributeModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    type: "text" as AttributeType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Update form data when attribute changes
  useEffect(() => {
    if (attribute) {
      setFormData({
        name: attribute.name,
        value: attribute.value,
        type: attribute.type,
      });
    }
  }, [attribute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attribute) return;
    
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(attribute.id, formData);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update attribute";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!isOpen || !attribute) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out"
          onClick={onClose}
        />
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 sm:my-8 sm:w-full sm:max-w-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                      Edit Attribute
                    </h3>
                  </div>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Attribute Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {attributeTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label} - {type.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <textarea
                        name="value"
                        id="value"
                        required
                        rows={3}
                        value={formData.value}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 sm:ml-3 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Attribute
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAttributeModal;
