import React, { useState } from 'react';
import { CheckIcon } from '../../../app/ui/icons';
import { useReceivedRequestsQuery, usePendingCountQuery, useRespondToRequestMutation } from '../hooks/useIdentityRequestsQuery';
import { type IdentityRequestWithDetails, type RespondToRequestRequest } from '../../../types/identityRequest';
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

// Individual request card component
interface RequestCardProps {
  request: IdentityRequestWithDetails;
  onRespond: (requestId: string, response: RespondToRequestRequest) => void;
  isResponding: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onRespond, isResponding }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<'approved' | 'denied' | null>(null);

  const handleStatusChange = (newStatus: 'approved' | 'denied') => {
    setPendingAction(newStatus);
    setResponseMessage(request.response_message || '');
    setShowResponseForm(true);
    setIsExpanded(true); // Expand to show the form
  };

  const handleConfirmResponse = () => {
    if (pendingAction) {
      onRespond(request.id, {
        status: pendingAction,
        response_message: responseMessage.trim() || undefined
      });
      setShowResponseForm(false);
      setResponseMessage('');
      setPendingAction(null);
    }
  };

  const handleCancelResponse = () => {
    setShowResponseForm(false);
    setResponseMessage('');
    setPendingAction(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Compact Header - Always Visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => !showResponseForm && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Context Icon */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
              style={{ backgroundColor: request.context_color || '#f59e0b' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            {/* Request Summary */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  Access to "{request.context_name || 'General'}" context
                </h3>
                {/* Status Badge */}
                {request.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                    Pending
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
            {/* Quick Action Buttons for Pending */}
            {request.status === 'pending' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRespond(request.id, { status: 'denied' });
                  }}
                  disabled={isResponding}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Deny
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRespond(request.id, { status: 'approved' });
                  }}
                  disabled={isResponding}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <CheckIcon className="w-3 h-3" />
                  Approve
                </button>
              </div>
            )}

            {/* Status Change Buttons for Approved/Denied */}
            {request.status === 'approved' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('denied');
                }}
                disabled={isResponding}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Change to Deny
              </button>
            )}

            {request.status === 'denied' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('approved');
                }}
                disabled={isResponding}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <CheckIcon className="w-3 h-3" />
                Change to Approve
              </button>
            )}

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
            {/* Shared Attributes */}
            {request.shared_attributes && request.shared_attributes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Information they'll receive ({request.shared_attributes.length} {request.shared_attributes.length === 1 ? 'field' : 'fields'})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {request.shared_attributes.map((attr) => (
                    <div 
                      key={attr.id} 
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {getAttributeIcon(attr.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{attr.name}</p>
                        <div className="text-xs text-gray-500 truncate">
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
            
            {(!request.shared_attributes || request.shared_attributes.length === 0) && (
              <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-yellow-800">No attributes configured for this context</span>
              </div>
            )}

            {/* Full Purpose */}
            {request.purpose && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900">Request Purpose</h4>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed">
                    {request.purpose}
                  </p>
                </div>
              </div>
            )}

            {/* Response Message Display */}
            {request.response_message && !showResponseForm && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900">Your Response</h4>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-800 leading-relaxed">
                    {request.response_message}
                  </p>
                </div>
              </div>
            )}

            {/* Response Form for Status Changes */}
            {showResponseForm && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {pendingAction === 'approved' ? 'Approve Request' : 'Deny Request'}
                  </h4>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-3">
                    You're changing this request to <span className={`font-semibold ${pendingAction === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                      {pendingAction}
                    </span>. Add an optional message to explain your decision:
                  </p>
                  
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder={`Explain why you're ${pendingAction === 'approved' ? 'approving' : 'denying'} this request...`}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={handleCancelResponse}
                    disabled={isResponding}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmResponse}
                    disabled={isResponding}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl ${
                      pendingAction === 'approved'
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                    }`}
                  >
                    {pendingAction === 'approved' ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {isResponding ? 'Updating...' : `Confirm ${pendingAction === 'approved' ? 'Approval' : 'Denial'}`}
                  </button>
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
const IdentityRequests: React.FC = () => {
  const { data: receivedRequests, isLoading, error } = useReceivedRequestsQuery();
  const { data: pendingCount } = usePendingCountQuery();
  const respondMutation = useRespondToRequestMutation();

  const handleRespond = (requestId: string, response: RespondToRequestRequest) => {
    respondMutation.mutate({ requestId, response });
  };

  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Identity Requests</h2>
              <p className="text-sm text-gray-600 mt-1">Manage who can access your personal information</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full border border-orange-200/50 text-sm font-medium">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Identity Requests</h2>
              <p className="text-sm text-gray-600 mt-1">Manage who can access your personal information</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
          <p className="font-medium">Failed to load identity requests</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Enhanced Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Identity Requests</h2>
            <p className="text-sm text-gray-600 mt-1">Manage who can access your personal information</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(pendingCount ?? 0) > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full border border-orange-200/50 text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
              {pendingCount} Pending
            </div>
          )}
          {(receivedRequests?.length ?? 0) > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              {receivedRequests?.length} Total
            </div>
          )}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {receivedRequests && receivedRequests.length > 0 ? (
          receivedRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onRespond={handleRespond}
              isResponding={respondMutation.isPending}
            />
          ))
        ) : (
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200/60 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Identity Requests Yet</h3>
              <p className="text-gray-600 text-lg mb-4 max-w-md mx-auto leading-relaxed">
                When someone requests access to your personal information, their requests will appear here.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Incoming requests will appear here
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default IdentityRequests;