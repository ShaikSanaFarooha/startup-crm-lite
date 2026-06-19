import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const TopPerformersCard = ({ data }) => {
  const { formatCurrency } = useSettings();

  // Find max revenue for relative progress bar scaling
  const maxRevenue = data.length > 0 ? data[0].revenue : 1;

  // Total won revenue
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Top Performing Reps</h3>
          <p className="text-xs text-slate-400 dark:text-gray-400">Sales representatives ranked by total won deal values</p>
        </div>
        <div className="p-2.5 rounded-xl border bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-950/35 dark:text-yellow-500 dark:border-yellow-900/30 shadow-sm shadow-yellow-500/5">
          <Trophy size={18} className="stroke-[2.2]" />
        </div>
      </div>

      {/* Rank List */}
      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-gray-500">
          No wins recorded by any representative yet
        </div>
      ) : (
        <div className="my-4 space-y-4 max-h-[220px] overflow-y-auto pr-1">
          {data.map((rep, index) => {
            const rank = index + 1;
            const percentage = maxRevenue ? Math.round((rep.revenue / maxRevenue) * 100) : 0;
            const totalPercentage = totalRevenue ? Math.round((rep.revenue / totalRevenue) * 100) : 0;

            // Style rank badges
            const rankBadges = {
              1: 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-950/45 dark:border-yellow-900/40 dark:text-yellow-500 shadow-yellow-500/5',
              2: 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 shadow-slate-500/5',
              3: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/45 dark:border-amber-900/40 dark:text-amber-500 shadow-amber-500/5'
            };

            const defaultRankStyle = 'bg-slate-50 border-slate-100 text-slate-500 dark:bg-gray-805 dark:border-gray-750 dark:text-gray-400';
            const activeRankStyle = rankBadges[rank] || defaultRankStyle;

            return (
              <div key={rep.name} className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                {/* Rank number badge */}
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-black shadow-sm ${activeRankStyle}`}>
                  {rank === 1 ? <Trophy size={14} /> : rank}
                </div>

                {/* Info & relative progress */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-gray-250">{rep.name}</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{formatCurrency(rep.revenue)}</span>
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 flex-1 bg-slate-100 dark:bg-gray-750 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-800 ${
                          rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-400' : rank === 3 ? 'bg-amber-600' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-gray-550 min-w-8 text-right">
                      {totalPercentage}% of total
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer statistics summary */}
      {data.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-gray-700 flex items-center justify-between text-xxs text-slate-400 dark:text-gray-500 font-semibold transition-colors duration-200">
          <span>Active reps: <strong className="text-slate-700 dark:text-gray-300">{data.length}</strong></span>
          <span className="inline-flex items-center gap-0.5 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100 dark:text-yellow-500 dark:bg-yellow-950/35 dark:border-yellow-900/30">
            <Award size={12} /> Target Qualified Leaders
          </span>
        </div>
      )}
    </div>
  );
};

export default TopPerformersCard;
