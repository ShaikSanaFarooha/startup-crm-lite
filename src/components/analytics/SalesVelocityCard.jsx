import React from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const SalesVelocityCard = ({ velocity, growth }) => {
  const { formatCurrency } = useSettings();

  const isNeutral = growth === 0;
  const isPositive = growth > 0;
  const absGrowth = Math.abs(growth);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Sales Velocity</h3>
          <p className="text-xs text-slate-400 dark:text-gray-400">Rate of revenue moving through the funnel</p>
        </div>
        <div className="p-2.5 rounded-xl border bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/35 dark:text-blue-400 dark:border-blue-900/30 shadow-sm shadow-blue-500/5">
          <Zap size={18} className="stroke-[2.2]" />
        </div>
      </div>

      {/* Value */}
      <div className="my-6">
        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight block">
          {formatCurrency(velocity)}/day
        </span>
        
        {/* Trend Indicator */}
        <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold">
          {isNeutral ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-500 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400">
              No change
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded border transition-colors ${
                isPositive
                  ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/35 dark:text-green-400 dark:border-green-900/30'
                  : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/35 dark:text-red-400 dark:border-red-900/30'
              }`}
            >
              {isPositive ? (
                <TrendingUp size={12} className="stroke-[2.5]" />
              ) : (
                <TrendingDown size={12} className="stroke-[2.5]" />
              )}
              <span>{isPositive ? '+' : '-'}{absGrowth}%</span>
            </span>
          )}
          <span className="text-slate-400 dark:text-gray-500 font-medium">vs prior period</span>
        </div>
      </div>

      {/* Info Formula footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-gray-700 text-xxs text-slate-400 dark:text-gray-550 leading-relaxed font-semibold transition-colors duration-200">
        <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold mb-1">How it is calculated:</p>
        <code className="bg-slate-50 dark:bg-gray-900 p-1.5 rounded block text-[9px] text-slate-600 dark:text-gray-300 font-mono select-all">
          (Leads × Win Rate × Avg Deal size) ÷ Avg Cycle Days
        </code>
      </div>
    </div>
  );
};

export default SalesVelocityCard;
