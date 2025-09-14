import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import StatCards from "../features/dashboard/ui/StatCards";
import ContextGrid from "../features/dashboard/ui/ContextGrid";
import AttributeGrid from "../features/dashboard/ui/AttributeGrid";
import IdentityRequests from "../features/dashboard/ui/IdentityRequests";
import SentRequests from "../features/dashboard/ui/SentRequests";
import PrivacyMatrix from "../features/dashboard/ui/PrivacyMatrix";
import ProfilePreview from "../features/dashboard/ui/ProfilePreview";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Persona.io
                </h1>
                <p className="text-xs text-gray-500 font-medium">Identity Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/request-access')}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-100 hover:bg-orange-200 px-4 py-2.5 text-sm font-medium text-orange-700 transition-all duration-200 hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Request Access
              </button>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Welcome, {user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                Welcome back, {user?.email?.split('@')[0]} 👋
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Manage your digital identity across contexts with <span className="font-semibold text-indigo-600">precision</span> and <span className="font-semibold text-purple-600">control</span>
              </p>
            </div>
            
            {/* Quick Action Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200/50 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                System Online
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200/50 shadow-sm">
                <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Privacy Protected
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200/50 shadow-sm">
                <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Real-time Sync
              </div>
            </div>
          </div>

          <StatCards />
          <ContextGrid />
          <AttributeGrid />
          <IdentityRequests />
          <SentRequests />
          <PrivacyMatrix />
          <ProfilePreview />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
