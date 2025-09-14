import { useState, useCallback, useRef } from "react";
import { type CreateAttributeRequest, type Attribute, type AttributeType } from "../../../types/attribute";
import { validateAttributeValue } from "../hooks/useProfilePreview";

// Formatting helper functions
const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Format based on length
  if (phoneNumber.length === 0) return '';
  if (phoneNumber.length <= 3) return phoneNumber;
  if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  if (phoneNumber.length <= 10) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  
  // For numbers longer than 10 digits, assume international format
  if (phoneNumber.length === 11 && phoneNumber.startsWith('1')) {
    return `+1 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
  }
  
  // For other international numbers, just add + prefix
  return `+${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 9)} ${phoneNumber.slice(9)}`;
};

const formatDate = (value: string): string => {
  // Remove all non-numeric characters
  const dateNumber = value.replace(/\D/g, '');
  
  // Format as MM/DD/YYYY
  if (dateNumber.length === 0) return '';
  if (dateNumber.length <= 2) return dateNumber;
  if (dateNumber.length <= 4) return `${dateNumber.slice(0, 2)}/${dateNumber.slice(2)}`;
  if (dateNumber.length <= 8) return `${dateNumber.slice(0, 2)}/${dateNumber.slice(2, 4)}/${dateNumber.slice(4)}`;
  
  // Limit to 8 digits (MMDDYYYY)
  return `${dateNumber.slice(0, 2)}/${dateNumber.slice(2, 4)}/${dateNumber.slice(4, 8)}`;
};

interface CreateAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attributeData: CreateAttributeRequest) => Promise<Attribute>;
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

const CreateAttributeModal = ({ isOpen, onClose, onSubmit }: CreateAttributeModalProps) => {
  const [formData, setFormData] = useState<CreateAttributeRequest>({
    name: "",
    value: "",
    type: "text",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Image staging handlers (no upload yet)
  const handleImageStage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB.');
      return;
    }

    setError(null);
    
    // Stage the image locally (don't upload yet)
    setUploadedImage(file);
    setImagePreview(URL.createObjectURL(file));
    // Don't set formData.value yet - we'll upload when form is submitted
  };

  // Upload the staged image to server
  const uploadStagedImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', response.status, response.statusText, errorData);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload success:', data);
      return data.data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageStage(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageStage(files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, value: '' }));
  };

  // Address autocomplete using Nominatim (free OpenStreetMap geocoding) with debouncing
  const fetchAddressSuggestions = useCallback((query: string) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    // Debounce the API call by 300ms
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}&countrycodes=us,ca,gb,au,de,fr,es,it,nl,se,no,dk,fi`
        );
        const data = await response.json();
        
        const suggestions = data.map((item: { display_name: string }) => item.display_name).slice(0, 5);
        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error('Address autocomplete error:', error);
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
      }
    }, 300);
  }, []);

  const handleAddressSelect = (address: string) => {
    setFormData(prev => ({ ...prev, value: address }));
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Attribute name cannot be empty.");
      return;
    }
    if (formData.name.length > 100) {
      setError("Attribute name must be less than 100 characters.");
      return;
    }

    // For image type, check if we have either a staged image or a URL
    if (formData.type === 'image') {
      if (!uploadedImage && !formData.value.trim()) {
        setError("Please upload an image or enter an image URL.");
        return;
      }
    } else {
      // For non-image types, check value normally
      if (!formData.value.trim()) {
        setError("Attribute value cannot be empty.");
        return;
      }

      // Validate attribute value based on type
      if (!validateAttributeValue(formData.value, formData.type)) {
        const errorMessages: Record<string, string> = {
          email: "Please enter a valid email address (e.g., user@example.com)",
          url: "Please enter a valid URL (e.g., https://example.com)",
          phone: "Please enter a valid phone number (e.g., +1234567890)",
          date: "Please enter a valid date",
        };
        setError(errorMessages[formData.type] || "Please enter a valid value for this attribute type.");
        return;
      }
    }

    setIsSubmitting(true);
    setIsUploading(true);
    
    try {
      const finalFormData = { ...formData };

      // If we have a staged image, upload it now
      if (uploadedImage && formData.type === 'image') {
        try {
          const imageUrl = await uploadStagedImage(uploadedImage);
          finalFormData.value = imageUrl;
        } catch {
          setError('Failed to upload image. Please try again.');
          return;
        }
      }

      await onSubmit(finalFormData);
      
      // Reset form
      setFormData({ name: "", value: "", type: "text" });
      setUploadedImage(null);
      setImagePreview(null);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create attribute";
      setError(message);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'value') {
      let formattedValue = value;
      
      // Apply formatting based on attribute type
      if (formData.type === 'phone') {
        formattedValue = formatPhoneNumber(value);
      } else if (formData.type === 'date') {
        formattedValue = formatDate(value);
      } else if (formData.type === 'address') {
        // Trigger address autocomplete
        fetchAddressSuggestions(value);
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
      
      // Reset address suggestions when type changes
      if (name === 'type') {
        setShowAddressSuggestions(false);
        setAddressSuggestions([]);
      }
    }
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
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                      Create New Attribute
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
                        Attribute Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={100}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="e.g., Full Name, Bio, LinkedIn"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500 text-right">
                        {formData.name.length}/100 characters
                      </p>
                    </div>

                    {/* Type Field */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Attribute Type
                      </label>
                      <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        required
                      >
                        {attributeTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label} - {type.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Value Field */}
                    <div>
                      <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      
                      {formData.type === 'image' ? (
                        <div className="space-y-4">
                          {/* Image Upload Area */}
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                              isDragOver
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {imagePreview ? (
                              <div className="space-y-4">
                                <div className="relative inline-block">
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-full max-h-48 rounded-lg shadow-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {uploadedImage?.name} ({((uploadedImage?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex flex-col items-center">
                                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <p className="text-lg font-medium text-gray-900 mb-1">
                                    Drop your image here
                                  </p>
                                  <p className="text-sm text-gray-600 mb-4">
                                    or click to browse files
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          
                          {/* Manual URL Input (Alternative) */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-white text-gray-500">or enter image URL</span>
                            </div>
                          </div>
                          
                          <input
                            type="url"
                            value={formData.value}
                            onChange={handleChange}
                            name="value"
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </div>
                      ) : formData.type === 'address' ? (
                        <div className="relative">
                          <textarea
                            name="value"
                            id="value"
                            value={formData.value}
                            onChange={handleChange}
                            rows={2}
                            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                              formData.value && !validateAttributeValue(formData.value, formData.type)
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                            placeholder="Start typing an address..."
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            🏠 Start typing for address suggestions from around the world
                          </p>
                          
                          {/* Address Suggestions Dropdown */}
                          {showAddressSuggestions && addressSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {addressSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleAddressSelect(suggestion)}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-indigo-50 focus:outline-none"
                                >
                                  <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-700">{suggestion}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : formData.type === 'phone' ? (
                        <div>
                          <input
                            type="tel"
                            name="value"
                            id="value"
                            value={formData.value}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                              formData.value && !validateAttributeValue(formData.value, formData.type)
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                            placeholder="(555) 123-4567"
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            📱 Formats automatically as you type (e.g., (555) 123-4567)
                          </p>
                        </div>
                      ) : formData.type === 'date' ? (
                        <div>
                          <input
                            type="text"
                            name="value"
                            id="value"
                            value={formData.value}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                              formData.value && !validateAttributeValue(formData.value, formData.type)
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                            placeholder="MM/DD/YYYY"
                            maxLength={10}
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            📅 Formats automatically as you type (e.g., 12/25/1990)
                          </p>
                        </div>
                      ) : formData.type === 'email' ? (
                        <input
                          type="email"
                          name="value"
                          id="value"
                          value={formData.value}
                          onChange={handleChange}
                          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                            formData.value && !validateAttributeValue(formData.value, formData.type)
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="john@example.com"
                          required
                        />
                      ) : formData.type === 'url' ? (
                        <input
                          type="url"
                          name="value"
                          id="value"
                          value={formData.value}
                          onChange={handleChange}
                          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                            formData.value && !validateAttributeValue(formData.value, formData.type)
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="https://example.com"
                          required
                        />
                      ) : (
                        <textarea
                          name="value"
                          id="value"
                          value={formData.value}
                          onChange={handleChange}
                          rows={3}
                          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                            formData.value && !validateAttributeValue(formData.value, formData.type)
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="Enter your attribute value"
                          required
                        />
                      )}
                      
                      {formData.value && !validateAttributeValue(formData.value, formData.type) && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formData.type === 'email' && 'Invalid email format'}
                          {formData.type === 'url' && 'Invalid URL format'}
                          {formData.type === 'phone' && 'Invalid phone number format'}
                          {formData.type === 'date' && 'Invalid date format'}
                          {!['email', 'url', 'phone', 'date'].includes(formData.type) && 'Invalid value'}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || (formData.type !== 'image' && !formData.value.trim()) || (formData.type === 'image' && !uploadedImage && !formData.value.trim())}
                className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 sm:ml-3 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {isUploading ? 'Uploading...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Attribute
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

export default CreateAttributeModal;
