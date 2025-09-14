import React, { useState } from 'react';
import { SearchIcon, UserIcon, ArrowLeftIcon } from '../app/ui/icons';
import { usersApi, type UserSearchResult, type UserContext } from '../lib/api/users';
import { identityRequestsApi } from '../lib/api/identityRequests';
import { useNavigate } from 'react-router-dom';

interface ContextCardProps {
  context: UserContext;
  onSelect: () => void;
  isSelected: boolean;
}

const ContextCard: React.FC<ContextCardProps> = ({ context, onSelect, isSelected }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-orange-500 bg-orange-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-4 h-4 rounded-full mt-1"
          style={{ backgroundColor: context.color }}
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{context.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{context.description}</p>
        </div>
      </div>
    </button>
  );
};

const RequestAccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchUserId, setSearchUserId] = useState('');
  const [searchResult, setSearchResult] = useState<UserSearchResult | null>(null);
  const [selectedContext, setSelectedContext] = useState<UserContext | null>(null);
  const [purpose, setPurpose] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchUserId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    const userId = parseInt(searchUserId.trim(), 10);
    if (isNaN(userId) || userId <= 0) {
      setError('Please enter a valid user ID (positive number)');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResult(null);
    setSelectedContext(null);

    try {
      const result = await usersApi.searchUserById(userId);
      setSearchResult(result);
      if (result.contexts.length === 0) {
        setError('This user has no available contexts to request');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('not found')) {
          setError('User not found. Please check the user ID.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to search for user');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!searchResult || !selectedContext || !purpose.trim()) {
      setError('Please select a context and provide a purpose');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await identityRequestsApi.createRequest({
        requestee_user_id: searchResult.id.toString(),
        context_id: selectedContext.id.toString(),
        purpose: purpose.trim(),
      });
      
      setSuccess('Request sent successfully!');
      // Clear form
      setSearchUserId('');
      setSearchResult(null);
      setSelectedContext(null);
      setPurpose('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to send request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Request Access</h1>
            <p className="text-gray-600 mt-1">Search for a user and request access to their context</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="userId"
                  type="text"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  placeholder="Enter user ID (e.g., 123)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the numeric ID of the user whose context you want to request
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search User'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResult && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID: {searchResult.id}</p>
                <p className="text-xs text-gray-400">
                  Joined {new Date(searchResult.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Available Contexts */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Available Contexts</h4>
              {searchResult.contexts.length > 0 ? (
                <div className="grid gap-3">
                  {searchResult.contexts.map((context) => (
                    <ContextCard
                      key={context.id}
                      context={context}
                      onSelect={() => setSelectedContext(context)}
                      isSelected={selectedContext?.id === context.id}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No contexts available</p>
              )}
            </div>
          </div>
        )}

        {/* Request Form */}
        {searchResult && selectedContext && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h4>
            
            <div className="mb-4 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Requesting access to:</span> {selectedContext.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">{selectedContext.description}</p>
            </div>

            <div className="mb-6">
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                Purpose <span className="text-red-500">*</span>
              </label>
              <textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Explain why you need access to this context..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Be clear about why you need access to this information
              </p>
            </div>

            <button
              onClick={handleSubmitRequest}
              disabled={isSubmitting || !purpose.trim()}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestAccessPage;
