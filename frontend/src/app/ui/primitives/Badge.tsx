type Props = {
  color?: "indigo" | "emerald" | "amber" | "slate" | "rose" | "blue";
  variant?: "soft" | "solid";
  children: string | number;
  className?: string;
};

const colorMap = {
  indigo: {
    soft: "bg-indigo-100 text-indigo-700",
    solid: "bg-indigo-600 text-white",
  },
  emerald: {
    soft: "bg-emerald-100 text-emerald-700",
    solid: "bg-emerald-600 text-white",
  },
  amber: {
    soft: "bg-amber-100 text-amber-700",
    solid: "bg-amber-500 text-white",
  },
  blue: {
    soft: "bg-blue-100 text-blue-700",
    solid: "bg-blue-600 text-white",
  },
  slate: {
    soft: "bg-slate-100 text-slate-700",
    solid: "bg-slate-700 text-white",
  },
  rose: {
    soft: "bg-rose-100 text-rose-700",
    solid: "bg-rose-600 text-white",
  },
};

const Badge = ({ color = "slate", variant = "soft", children, className = "" }: Props) => {
  const styles = colorMap[color][variant];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

