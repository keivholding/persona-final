import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Persona.io
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.first_name || user?.email}!
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Your Contexts
            </h2>
            <p className="text-gray-600">
              Manage your different persona contexts
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Coming soon...
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Attributes
            </h2>
            <p className="text-gray-600">
              Manage your identity attributes
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Coming soon...
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Privacy Matrix
            </h2>
            <p className="text-gray-600">
              Control attribute visibility
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Coming soon...
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
