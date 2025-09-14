import React, { useState } from 'react';
import { CheckIcon } from '../../../app/ui/icons';
import { useSentRequestsQuery } from '../hooks/useIdentityRequestsQuery';
import { type IdentityRequestWithDetails } from '../../../types/identityRequest';
import AttributeRenderer from './AttributeRenderer';

// Helper function to get attribute type icons
const getAttributeIcon = (type: string) => {
  switch (type) {
    case 'email':
      return '📧';
    case 'phone':
      return '📱';
    case 'url':
      return '🔗';
    case 'image':
      return '🖼️';
    case 'date':
      return '📅';
    case 'address':
      return '🏠';
    case 'text':
    default:
      return '📝';
  }
};

// Individual sent request card component
interface SentRequestCardProps {
  request: IdentityRequestWithDetails;
}

const SentRequestCard: React.FC<SentRequestCardProps> = ({ request }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const requesteeInitial = request.requestee_email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Compact Header - Always Visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Requestee Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {requesteeInitial}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className={`w-2 h-2 rounded-full ${
                  request.status === 'pending' ? 'bg-amber-400 animate-pulse' :
                  request.status === 'approved' ? 'bg-emerald-500' :
                  'bg-red-500'
                }`}></div>
              </div>
            </div>
            
            {/* Request Summary */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  Requested access to "{request.context_name || 'General'}" context
                </h3>
                {/* Status Badge */}
                {request.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                    Waiting
                  </span>
                )}
                {request.status === 'approved' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                    <CheckIcon className="w-3 h-3" />
                    Approved
                  </span>
                )}
                {request.status === 'denied' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Denied
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">
                {request.purpose || 'No purpose provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Expand/Collapse Icon */}
            <div className="text-gray-400">
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="space-y-6">
            {/* Context Details */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: request.context_color || '#6366f1' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">"{request.context_name || 'General'}" Context</h4>
                  <p className="text-sm text-gray-600">You requested access to this identity profile</p>
                </div>
              </div>
              
              {/* Shared Attributes (only if approved) */}
              {request.status === 'approved' && request.shared_attributes && request.shared_attributes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-semibold text-indigo-800">
                      Information received ({request.shared_attributes.length} {request.shared_attributes.length === 1 ? 'field' : 'fields'}):
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {request.shared_attributes.map((attr) => (
                      <div 
                        key={attr.id} 
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200/50 shadow-sm"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {getAttributeIcon(attr.type)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{attr.name}</p>
                          <div className="text-xs text-gray-700 truncate font-medium">
                            <AttributeRenderer attribute={attr} className="text-xs" />
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {attr.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {request.status === 'approved' && (!request.shared_attributes || request.shared_attributes.length === 0) && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-yellow-800">No attributes were shared for this context.</span>
                </div>
              )}

              {request.status === 'denied' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-800">Access denied - no information shared.</span>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-amber-800">Waiting for their response.</span>
                </div>
              )}
            </div>

            {/* Purpose */}
            {request.purpose && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900">Your Request Purpose</h4>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed">
                    {request.purpose}
                  </p>
                </div>
              </div>
            )}

            {/* Response Message Display */}
            {request.response_message && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900">Their Response</h4>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-purple-800 leading-relaxed">
                    {request.response_message}
                  </p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Requested {new Date(request.requested_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              {request.responded_at && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M18 14h.01" />
                  </svg>
                  Responded {new Date(request.responded_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
const SentRequests: React.FC = () => {
  const { data: sentRequests, isLoading, error } = useSentRequestsQuery();

  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Requests</h2>
              <p className="text-sm text-gray-600 mt-1">Track identity requests you've sent to others</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full border border-blue-200/50 text-sm font-medium">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            Loading...
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Requests</h2>
              <p className="text-sm text-gray-600 mt-1">Track identity requests you've sent to others</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
          <p className="font-medium">Failed to load your requests</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Requests</h2>
            <p className="text-sm text-gray-600 mt-1">Track identity requests you've sent to others</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(sentRequests?.length ?? 0) > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              {sentRequests?.length} Sent
            </div>
          )}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {sentRequests && sentRequests.length > 0 ? (
          sentRequests.map((request) => (
            <SentRequestCard key={request.id} request={request} />
          ))
        ) : (
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200/60 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Outgoing Requests Yet</h3>
              <p className="text-gray-600 text-lg mb-4 max-w-md mx-auto leading-relaxed">
                You haven't sent any requests for personal information yet.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sent requests will appear here
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SentRequests;