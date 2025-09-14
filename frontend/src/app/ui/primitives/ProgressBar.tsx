type Props = { 
  value: number;
  className?: string;
  color?: "indigo" | "emerald" | "yellow" | "red" | "gray";
};

const colorClasses = {
  indigo: "bg-indigo-600",
  emerald: "bg-emerald-600",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  gray: "bg-gray-400",
};

const ProgressBar = ({ value, className = "", color = "indigo" }: Props) => {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full rounded-full bg-gray-200 ${className}`}>
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`} 
        style={{ width: `${width}%` }} 
      />
    </div>
  );
};

export default ProgressBar;

