import { useState } from "react";
import { type CreateContextRequest, type Context } from "../../../types/context";

interface CreateContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contextData: CreateContextRequest) => Promise<Context>;
}

const predefinedColors = [
  "#6366f1", // Indigo
  "#10b981", // Emerald  
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
];

const CreateContextModal = ({ isOpen, onClose, onSubmit }: CreateContextModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6366f1",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // Reset form and close modal
      setFormData({ name: "", description: "", color: "#6366f1" });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create context";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Animated Backdrop with Blur */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out"
          onClick={onClose}
        />
        
        {/* Animated Modal */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 sm:my-8 sm:w-full sm:max-w-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                      Create New Context
                    </h3>
                  </div>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Context Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        maxLength={50}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="e.g., Work, Friends, Public"
                      />
                    </div>

                    {/* Description Field */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        required
                        maxLength={200}
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="e.g., Professional identity for work-related contexts"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.description.length}/200 characters
                      </p>
                    </div>

                    {/* Color Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Theme
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {predefinedColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                            className={`h-10 w-full rounded-md border-2 transition-all ${
                              formData.color === color 
                                ? "border-gray-900 shadow-md scale-105" 
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="color"
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          className="h-8 w-16 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-500">Custom color: {formData.color}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.description.trim()}
                className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 sm:ml-3 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Context
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

export default CreateContextModal;
