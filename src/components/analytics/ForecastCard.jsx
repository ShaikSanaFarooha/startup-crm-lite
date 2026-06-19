import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const ForecastCard = ({ forecastedRevenue, activeLeads, monthlyRevenues }) => {
  const { formatCurrency } = useSettings();

  // Calculate dynamic confidence score:
  // Base 75%. If we have more than 10 leads in 'Proposal Sent' or 'Meeting Scheduled', confidence increases.
  // If active pipeline is low, confidence is lower.
  const activeProposalCount = activeLeads.filter(l => ['Proposal Sent', 'Proposal'].includes(l.status)).length;
  const confidenceScore = Math.min(98, Math.max(45, 60 + activeProposalCount * 1.5 + Math.min(20, activeLeads.length * 0.2)));

  // Calculate growth trend: Predicted next month vs latest month's revenue
  let latestMonthRevenue = 0;
  if (monthlyRevenues && monthlyRevenues.length > 0) {
    latestMonthRevenue = monthlyRevenues[monthlyRevenues.length - 1].revenue || 0;
  }
  const isGrowing = forecastedRevenue > latestMonthRevenue;
  const trendPercent = latestMonthRevenue ? Math.round(((forecastedRevenue - latestMonthRevenue) / latestMonthRevenue) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Growth Forecasting</h3>
          <p className="text-xs text-slate-400 dark:text-gray-400">Revenue projection for the upcoming calendar month</p>
        </div>
        <div className="p-2.5 rounded-xl border bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/35 dark:text-amber-500 dark:border-amber-900/30 shadow-sm shadow-amber-500/5">
          <Sparkles size={18} className="stroke-[2.2]" />
        </div>
      </div>

      {/* Value */}
      <div className="my-6">
        <span className="text-xxs font-bold text-slate-400 dark:text-gray-450 uppercase tracking-wider block">
          Predicted Revenue Next Month
        </span>
        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight block mt-1">
          {formatCurrency(forecastedRevenue)}
        </span>
        
        {/* Trend Indicator */}
        <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-slate-500">
          {isGrowing ? (
            <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/35 dark:border-emerald-900/30 px-2 py-0.5 rounded border">
              <TrendingUp size={12} className="stroke-[2.5]" />
              <span>+{trendPercent}% growth</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-slate-600 bg-slate-50 border-slate-100 dark:text-gray-400 dark:bg-gray-900 dark:border-gray-800 px-2 py-0.5 rounded border">
              <span>{trendPercent}% vs current month</span>
            </span>
          )}
          <span className="text-slate-400 dark:text-gray-550 font-medium">projected trend</span>
        </div>
      </div>

      {/* Confidence Score & Breakdown */}
      <div className="pt-4 border-t border-slate-100 dark:border-gray-700 grid grid-cols-2 gap-4">
        {/* Confidence Progress */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-450 uppercase tracking-wider block">
            Confidence Score
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-800 dark:text-gray-250">{Math.round(confidenceScore)}%</span>
            <div className="h-2 w-full bg-slate-100 dark:bg-gray-750 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  confidenceScore > 75 ? 'bg-green-500' : confidenceScore > 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${confidenceScore}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Forecast Rating Badge */}
        <div className="space-y-1 text-right">
          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-450 uppercase tracking-wider block">
            Model Rating
          </span>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 dark:text-blue-400 dark:bg-blue-950/35 dark:border-blue-900/30 px-2 py-0.5 rounded-lg mt-0.5">
            {confidenceScore > 80 ? (
              <>
                <Award size={12} /> High Trust
              </>
            ) : (
              <>
                <ShieldAlert size={12} /> Stable Pace
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
