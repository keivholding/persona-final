const Topbar = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto max-w-[1400px] px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="relative w-full max-w-md">
            <input
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm focus-ring placeholder:text-gray-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1.5 py-0.5 text-xs font-sans text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              📊 Export Data
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
              ➕ New Context
            </button>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2">
              <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-white">
                <img
                  src="https://i.pravatar.cc/80?img=5"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">Jane Doe</span>
              <div className="h-4 w-4 text-gray-400">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

