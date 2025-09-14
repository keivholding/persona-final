import { useState } from "react";
import { LayersIcon } from "../../../app/ui/icons";
import ProgressBar from "../../../app/ui/primitives/ProgressBar";
import ContextDropdown from "./ContextDropdown";
import { useContextStats } from "../hooks/useContextStats";
import { type Context } from "../../../types/context";
import { type PrivacyMatrixData } from "../../../types/privacyMatrix";
import ContextPreviewModal from "./ContextPreviewModal";

interface ContextCardProps {
  context: Context;
  matrixData: PrivacyMatrixData | null;
  onEdit: (context: Context) => void;
  onDelete: (context: Context) => void;
  gradient: string;
}

const ContextCard = ({ context, matrixData, onEdit, onDelete, gradient }: ContextCardProps) => {
  const stats = useContextStats(matrixData, context.id);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"; // Very private
    if (score >= 60) return "text-yellow-600"; // Moderate privacy
    if (score >= 40) return "text-orange-600"; // Low privacy
    return "text-red-600"; // Very public
  };

  const getPrivacyScoreLabel = (score: number) => {
    if (score >= 80) return "Highly Private";
    if (score >= 60) return "Moderately Private";
    if (score >= 40) return "Somewhat Public";
    return "Very Public";
  };

  return (
    <div className="group rounded-2xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl hover:border-gray-300/50 transition-all duration-300 overflow-hidden">
      {/* Header with gradient */}
      <div className={`relative bg-gradient-to-br ${gradient} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <LayersIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold truncate">{context.name}</h3>
                <p className="text-sm text-white/90 font-medium truncate">{context.description}</p>
              </div>
            </div>
          </div>
          <ContextDropdown 
            context={context}
            onEdit={() => onEdit(context)}
            onDelete={() => onDelete(context)}
          />
        </div>

        {/* Privacy Score Badge */}
        <div className="absolute top-6 right-16">
          <div className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1">
            <span className="text-xs font-semibold text-white/90">
              {stats.privacyScore}% Private
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.visibleAttributes}</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Visible</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-600">{stats.hiddenAttributes}</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hidden</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalAttributes}</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</div>
          </div>
        </div>

        {/* Progress Bar and Privacy Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Privacy Level</span>
            <span className={`font-semibold ${getPrivacyScoreColor(stats.privacyScore)}`}>
              {getPrivacyScoreLabel(stats.privacyScore)}
            </span>
          </div>
          
          {/* Privacy-focused progress bar (higher = more private/hidden) */}
          <div className="relative">
            <ProgressBar 
              value={stats.privacyScore} 
              className="h-2 bg-gray-100"
              color={stats.privacyScore >= 60 ? "emerald" : stats.privacyScore >= 40 ? "yellow" : "red"}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Showing {stats.visibilityPercentage}% of attributes</span>
            <span>{stats.hiddenAttributes} attributes private</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
          <button 
            onClick={() => onEdit(context)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200 group"
          >
            <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-all duration-200 group"
          >
            <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
        </div>
      </div>
      
      {/* Preview Modal */}
      <ContextPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        context={context}
        matrixData={matrixData}
      />
    </div>
  );
};

export default ContextCard;
