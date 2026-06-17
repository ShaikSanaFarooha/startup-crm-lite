import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The title/label of the metric.
 * @property {string|number} value - The big number value to display.
 * @property {React.ComponentType<{size?: number, className?: string}>} icon - The Lucide React icon component to render.
 * @property {string|number} change - The percentage change vs last month (e.g., "+12.5%", -4.2).
 * @property {'primary'|'success'|'warning'|'danger'|string} color - The theme color key or custom class suffix for styling the icon background and text.
 */

/**
 * StatsCard Component
 * Renders a single CRM metric with an icon, big number, and percentage change indicator.
 *
 * @param {StatsCardProps} props - The component props.
 * @returns {React.JSX.Element} The rendered StatsCard component.
 */
const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  // Determine if the change is positive or negative
  const changeString = String(change);
  const isNegative = changeString.startsWith('-');
  const cleanChange = changeString.replace(/[+-]/, '');

  // Map theme colors to specific Tailwind utility classes
  const colorMap = {
    primary: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      glow: 'shadow-blue-500/10'
    },
    success: {
      bg: 'bg-green-50 text-green-600',
      border: 'border-green-100',
      glow: 'shadow-green-500/10'
    },
    warning: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      glow: 'shadow-amber-500/10'
    },
    danger: {
      bg: 'bg-red-50 text-red-600',
      border: 'border-red-100',
      glow: 'shadow-red-500/10'
    }
  };

  // Safe fallback to primary if color is not matching predefined keys
  const activeColor = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${activeColor.bg} ${activeColor.border} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">
          {value}
        </span>
        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
              isNegative
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-green-50 text-green-600 border border-green-100'
            }`}
          >
            {isNegative ? (
              <TrendingDown size={12} className="stroke-[2.5]" />
            ) : (
              <TrendingUp size={12} className="stroke-[2.5]" />
            )}
            <span>{cleanChange}%</span>
          </span>
          <span className="text-slate-400">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
