import { CardIcon, CheckIcon, EyeSlashIcon, ShieldIcon } from "../../../app/ui/icons";
import { useStatsCalculation } from "../hooks/useStatsCalculation";

const StatCards = () => {
  const { stats, isLoading, error } = useStatsCalculation();

  // Map colors to gradient classes
  const getGradientClass = (color: string) => {
    const gradientMap: Record<string, string> = {
      blue: "from-blue-500 to-cyan-600",
      emerald: "from-emerald-500 to-teal-600", 
      indigo: "from-indigo-500 to-purple-600",
      amber: "from-amber-500 to-orange-600",
      yellow: "from-yellow-500 to-orange-600",
      red: "from-red-500 to-red-600"
    };
    return gradientMap[color] || "from-gray-500 to-gray-600";
  };

  const statCards = [
    { 
      label: "Active Contexts", 
      value: stats.activeContexts.current, 
      color: "blue" as const, 
      Icon: CardIcon,
      trend: stats.activeContexts.trend,
      bgGradient: getGradientClass("blue")
    },
    { 
      label: "Profile Attributes", 
      value: stats.profileAttributes.current, 
      color: "emerald" as const, 
      Icon: CheckIcon,
      trend: stats.profileAttributes.trend,
      bgGradient: getGradientClass("emerald")
    },
    { 
      label: "Hidden Fields", 
      value: stats.hiddenFields.current, 
      color: "indigo" as const, 
      Icon: EyeSlashIcon,
      trend: `${Math.round(stats.hiddenFields.percentage)}% of ${stats.hiddenFields.total} total`,
      bgGradient: getGradientClass("indigo")
    },
    { 
      label: "Privacy Score", 
      value: `${stats.privacyScore.score}%`, 
      color: stats.privacyScore.color, 
      Icon: ShieldIcon,
      trend: stats.privacyScore.level,
      bgGradient: getGradientClass(stats.privacyScore.color)
    },
  ];

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/50 shadow-lg"
          >
            <div className="loading-shimmer h-40"></div>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full p-8 text-center bg-red-50 rounded-2xl border border-red-200">
          <p className="text-red-600 font-medium">Failed to load dashboard statistics</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((s) => (
        <div 
          key={s.label} 
          className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${s.bgGradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          {/* Content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${s.bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <s.Icon className="h-6 w-6 text-white" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                s.color === "blue" ? "bg-blue-100 text-blue-700" :
                s.color === "emerald" ? "bg-emerald-100 text-emerald-700" :
                s.color === "indigo" ? "bg-indigo-100 text-indigo-700" :
                "bg-amber-100 text-amber-700"
              }`}>
                {s.trend}
              </div>
            </div>

            {/* Main Value */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                {s.value}
              </div>
              <div className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                {s.label}
              </div>
            </div>

            {/* Bottom accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${s.bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatCards;

