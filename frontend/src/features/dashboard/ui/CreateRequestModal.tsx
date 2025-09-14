import React, { useState } from 'react';
import type { CreateIdentityRequestRequest } from '../../../types/identityRequest';
import { useCreateRequestMutation } from '../hooks/useIdentityRequestsQuery';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CreateIdentityRequestRequest>({
    requestee_user_id: '',
    context_id: '',
    purpose: '',
  });
  const [requesteeEmail, setRequesteeEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!requesteeEmail.trim()) {
      setError('Please enter the email of the person you want to request from.');
      return;
    }

    if (!formData.context_id) {
      setError('Please select a context.');
      return;
    }

    try {
      // For now, we'll need to convert email to user ID
      // In a real app, you'd have an API to lookup users by email
      // For demo purposes, let's assume we have a way to get user ID
      const demoUserId = '2'; // This would be looked up via API

      await createMutation.mutateAsync({
        ...formData,
        requestee_user_id: demoUserId,
      });

      // Reset form and close modal
      setFormData({
        requestee_user_id: '',
        context_id: '',
        purpose: '',
      });
      setRequesteeEmail('');
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create request';
      setError(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'requesteeEmail') {
      setRequesteeEmail(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Request Identity Access</h3>
                  <p className="text-sm text-orange-100">Ask someone to share their context with you</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-1 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Requestee Email */}
            <div>
              <label htmlFor="requesteeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Request From User
              </label>
              <input
                type="email"
                name="requesteeEmail"
                id="requesteeEmail"
                value={requesteeEmail}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="sarah@example.com"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the email address of the person whose context you want to access
              </p>
            </div>

            {/* Context Selection */}
            <div>
              <label htmlFor="context_id" className="block text-sm font-medium text-gray-700 mb-2">
                Which Context?
              </label>
              <select
                name="context_id"
                id="context_id"
                value={formData.context_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                required
              >
                <option value="">Select a context type...</option>
                <option value="work">Work Context</option>
                <option value="personal">Personal Context</option>
                <option value="friends">Friends Context</option>
                <option value="professional">Professional Context</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                What context are you requesting access to?
              </p>
            </div>

            {/* Purpose */}
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                Purpose (Optional)
              </label>
              <textarea
                name="purpose"
                id="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                placeholder="Why do you need access to this information? (e.g., for collaboration, networking, etc.)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Help them understand why you need their information
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2.5 text-sm font-medium text-white hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestModal;
