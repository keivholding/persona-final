import { useState } from "react";
import Toggle from "../../../app/ui/primitives/Toggle";
import { ShieldIcon } from "../../../app/ui/icons";
import { usePrivacyMatrixQuery, useToggleAttributeMutation } from "../hooks/usePrivacyMatrixQuery";
import AttributeRenderer from "./AttributeRenderer";
import { type AttributeType } from "../../../types/attribute";

// Helper function to get context icon and color
const getContextStyle = (context: { color: string }) => {
  const colorMap: Record<string, { emoji: string; textColor: string }> = {
    "#6366f1": { emoji: "💼", textColor: "text-indigo-600" },
    "#10b981": { emoji: "👥", textColor: "text-emerald-600" },
    "#f59e0b": { emoji: "🌟", textColor: "text-amber-600" },
    "#ef4444": { emoji: "🏠", textColor: "text-red-600" },
    "#8b5cf6": { emoji: "🎨", textColor: "text-violet-600" },
    "#06b6d4": { emoji: "🌐", textColor: "text-cyan-600" },
    "#84cc16": { emoji: "🔬", textColor: "text-lime-600" },
    "#f97316": { emoji: "⚡", textColor: "text-orange-600" },
  };
  
  return colorMap[context.color] || { emoji: "📝", textColor: "text-gray-600" };
};

const PrivacyMatrix = () => {
  const { data: matrixData, isLoading, error } = usePrivacyMatrixQuery();
  const toggleMutation = useToggleAttributeMutation();
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleToggle = async (attributeId: string, contextId: string, isCurrentlyAssigned: boolean) => {
    const toggleKey = `${attributeId}-${contextId}`;
    setIsToggling(toggleKey);
    
    try {
      await toggleMutation.mutateAsync({ attributeId, contextId, isCurrentlyAssigned });
    } catch (err) {
      console.error("Toggle failed:", err);
    } finally {
      setIsToggling(null);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-6">

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white card-shadow">
          <div className="p-8 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading privacy matrix...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white card-shadow">
          <div className="p-8 text-center">
            <p className="text-red-600 mb-2">Failed to load privacy matrix</p>
            <p className="text-gray-500 text-sm">{error?.message || 'Unknown error'}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!matrixData || matrixData.attributes.length === 0 || matrixData.contexts.length === 0) {
    return (
      <section className="space-y-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <ShieldIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Privacy Matrix</h2>
              <p className="text-sm text-gray-600 mt-1">Control which attributes are visible in each context</p>
            </div>
          </div>

        </div>

        {/* Beautiful Empty State */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200/60 p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
          <div className="relative">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <ShieldIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Privacy Settings Yet</h3>
            <p className="text-gray-600 text-lg mb-4 max-w-md mx-auto leading-relaxed">
              Create some contexts and attributes to start managing your privacy settings.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
              Privacy controls will appear here
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Enhanced Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
            <ShieldIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Privacy Matrix</h2>
            <p className="text-sm text-gray-600 mt-1">Control what information is shared in each context</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm text-gray-600">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            Matrix View
          </div>
        
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white card-shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-900 w-1/3">Attribute</th>
              {matrixData.contexts.map((context) => {
                const style = getContextStyle(context);
                return (
                  <th key={context.id} className="px-6 py-4 font-semibold text-gray-900 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={style.textColor}>{style.emoji}</span>
                      <span className="truncate">{context.name}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {matrixData.matrix.map((row, index) => (
              <tr key={row.attribute.id} className={`hover:bg-gray-50/80 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-6 py-5 font-medium text-gray-900">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{row.attribute.name}</span>
                      <span className="text-xs text-gray-500 uppercase tracking-wide px-2 py-0.5 bg-gray-100 rounded-full">
                        {row.attribute.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 max-w-sm">
                      <AttributeRenderer 
                        attribute={{
                          ...row.attribute,
                          user_id: '',
                          created_at: '',
                          updated_at: '',
                          type: row.attribute.type as AttributeType
                        }}
                        className="font-medium"
                      />
                    </div>
                  </div>
                </td>
                {matrixData.contexts.map((context) => {
                  const isAssigned = row.contexts[context.id] || false;
                  const toggleKey = `${row.attribute.id}-${context.id}`;
                  const isCurrentlyToggling = isToggling === toggleKey;
                  
                  return (
                    <td key={context.id} className="px-6 py-5 text-center">
                      <Toggle 
                        checked={isAssigned}
                        disabled={isCurrentlyToggling}
                        onChange={() => handleToggle(row.attribute.id, context.id, isAssigned)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PrivacyMatrix;