import Badge from "../../../app/ui/primitives/Badge";
import { BellIcon } from "../../../app/ui/icons";

type RequestItem = {
  id: string;
  app: string;
  description: string;
  status: "pending" | "approved" | "denied";
  requestedAt: string;
  fields: string[];
  sharedAs?: string;
};

const mockRequests: RequestItem[] = [
  {
    id: "spotify",
    app: "Spotify",
    description: "Music streaming service",
    status: "pending",
    requestedAt: "Jun 12, 2025",
    fields: ["Name", "Email", "Birth Date", "+2"],
  },
  {
    id: "linkedin",
    app: "LinkedIn",
    description: "Professional network",
    status: "approved",
    requestedAt: "May 29, 2025",
    fields: ["Full Name", "Work Email", "Position", "Company"],
    sharedAs: "Work",
  },
  {
    id: "facebook",
    app: "Facebook",
    description: "Social media platform",
    status: "denied",
    requestedAt: "Jun 10, 2025",
    fields: ["Full Name", "Phone", "Location", "+4"],
  },
];

const RequestsList = () => {
  return (
    <section className="space-y-8">
      {/* Enhanced Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
            <BellIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Identity Requests</h2>
            <p className="text-sm text-gray-600 mt-1">Apps requesting access to your personal information</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm text-gray-600">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
            {mockRequests.filter(r => r.status === 'pending').length} Pending
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View All
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {mockRequests.map((r) => (
          <div
            key={r.id}
            className={`group rounded-xl border-2 bg-white p-6 card-shadow hover:card-shadow-lg transition-all duration-200 ${
              r.status === "pending"
                ? "border-l-4 border-l-blue-500 border-t-blue-100 border-r-blue-100 border-b-blue-100 hover:border-blue-200"
                : r.status === "approved"
                ? "border-l-4 border-l-emerald-500 border-t-emerald-100 border-r-emerald-100 border-b-emerald-100 hover:border-emerald-200"
                : "border-l-4 border-l-rose-500 border-t-rose-100 border-r-rose-100 border-b-rose-100 hover:border-rose-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-5">
                <div className={`relative grid h-14 w-14 place-items-center rounded-xl text-white font-bold text-lg shadow-lg ${
                  r.app === "Spotify" ? "bg-gradient-to-br from-green-400 to-green-600" :
                  r.app === "LinkedIn" ? "bg-gradient-to-br from-blue-500 to-blue-700" :
                  r.app === "Facebook" ? "bg-gradient-to-br from-blue-600 to-blue-800" :
                  "bg-gradient-to-br from-gray-400 to-gray-600"
                }`}>
                  {r.app === "Spotify" && "♪"}
                  {r.app === "LinkedIn" && "💼"}
                  {r.app === "Facebook" && "📘"}
                  {!["Spotify", "LinkedIn", "Facebook"].includes(r.app) && r.app.slice(0, 1)}
                  
                  {r.status === "pending" && (
                    <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
                  )}
                  {r.status === "approved" && (
                    <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {r.status === "denied" && (
                    <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center">
                      <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{r.app}</h3>
                    {r.status === "pending" && (
                      <Badge color="blue" className="animate-pulse">🔄 Profile Access</Badge>
                    )}
                    {r.status === "approved" && (
                      <Badge color="emerald">✅ Approved</Badge>
                    )}
                    {r.status === "denied" && <Badge color="rose">❌ Denied</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 font-medium">{r.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {r.fields.map((f, index) => (
                      <span
                        key={f}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                          index < 3 ? 
                            "bg-indigo-50 text-indigo-700 border-indigo-200" :
                            "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {index < 3 && "🔒 "}{f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                {r.status === "pending" ? (
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-600">Share as:</div>
                    <select className="rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium focus-ring">
                      <option value="">Select context...</option>
                      <option value="work">💼 Work</option>
                      <option value="friends">👥 Friends</option>
                      <option value="public">🌐 Public</option>
                    </select>
                    <button className="rounded-lg border-2 border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all">
                      ❌ Deny
                    </button>
                    <button className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2 text-sm font-semibold text-white hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg">
                      ✅ Approve
                    </button>
                  </div>
                ) : r.status === "approved" ? (
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-600">Shared as:</div>
                    <Badge color="indigo" variant="solid" className="shadow-sm">
                      {`💼 ${r.sharedAs || ""}`}
                    </Badge>
                    <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                      🔄 Revoke
                    </button>
                    <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                      ✏️ Edit
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-500">Requested:</div>
                      <div className="text-gray-700 font-medium">{r.requestedAt}</div>
                    </div>
                    <button className="rounded-lg bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200 transition-colors">
                      👁️ Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RequestsList;