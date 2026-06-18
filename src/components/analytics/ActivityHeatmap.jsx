import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ActivityHeatmap = ({ data }) => {
  const { isDarkMode } = useTheme();

  // Activity coloring helper
  const getCellColor = (count) => {
    if (isDarkMode) {
      if (count === 0) return 'bg-slate-800 border-slate-700 hover:bg-slate-700';
      if (count <= 2) return 'bg-emerald-950/40 border-emerald-900/30 hover:bg-emerald-900/60 text-emerald-400';
      if (count <= 4) return 'bg-emerald-800/50 border-emerald-700/30 hover:bg-emerald-700 text-emerald-200';
      if (count <= 6) return 'bg-emerald-600 border-emerald-500/40 hover:bg-emerald-500 text-white';
      return 'bg-emerald-500 border-emerald-400/40 hover:bg-emerald-400 text-white';
    } else {
      if (count === 0) return 'bg-slate-100 border-slate-200/40 hover:bg-slate-200';
      if (count <= 2) return 'bg-emerald-100 border-emerald-200/40 hover:bg-emerald-200 text-emerald-800';
      if (count <= 4) return 'bg-emerald-300 border-emerald-400/40 hover:bg-emerald-300 text-emerald-950';
      if (count <= 6) return 'bg-emerald-500 border-emerald-600/40 hover:bg-emerald-600 text-white';
      return 'bg-emerald-700 border-emerald-800/40 hover:bg-emerald-800 text-white';
    }
  };

  // Determine label ranges
  const startDateStr = data.length > 0 ? data[0].displayDate : '';
  const endDateStr = data.length > 0 ? data[data.length - 1].displayDate : '';

  // Sum total activities
  const totalActivities = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Sales Activity Heatmap</h3>
          <p className="text-xs text-slate-400 dark:text-gray-400">GitHub-style density tracking of captured leads, meetings, and calls</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-gray-500">
          No activities recorded in this period
        </div>
      ) : (
        <div className="py-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            <span>{startDateStr}</span>
            <span>{endDateStr}</span>
          </div>

          <div className="flex items-center gap-3 justify-center">
            {/* Weekdays Labels */}
            <div className="grid grid-rows-7 gap-1.5 text-[9px] font-bold text-slate-400 dark:text-gray-500 h-36 justify-between select-none">
              <span>Mon</span>
              <span className="opacity-0">Tue</span>
              <span>Wed</span>
              <span className="opacity-0">Thu</span>
              <span>Fri</span>
              <span className="opacity-0">Sat</span>
              <span>Sun</span>
            </div>

            {/* Grid Map: 7 rows high, grid-flow-col places cells into columns */}
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 h-36 items-center">
              {data.map((day, idx) => (
                <div key={idx} className="group relative">
                  <div
                    className={`w-4 h-4 rounded border ${getCellColor(day.count)} transition-all duration-200 cursor-pointer`}
                    aria-label={`Activity count: ${day.count} on ${day.date}`}
                  />
                  
                  {/* CSS Tooltip */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white p-2.5 rounded-xl text-[10px] font-semibold leading-relaxed shadow-xl border border-slate-800 z-50 pointer-events-none whitespace-nowrap">
                    <p className="font-extrabold text-blue-400 uppercase tracking-wider text-[8px] mb-1">{day.displayDate}</p>
                    <p className="text-slate-100 font-bold">Total events: {day.count}</p>
                    <div className="mt-1 pt-1 border-t border-slate-800 space-y-0.5 text-slate-400 text-[9px]">
                      <p>Leads Created: <span className="text-white font-bold">{day.created}</span></p>
                      <p>Meetings Scheduled: <span className="text-white font-bold">{day.meetings}</span></p>
                      <p>Calls Logged: <span className="text-white font-bold">{day.calls}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend indicator */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-gray-700 text-xxs text-slate-400 dark:text-gray-500 font-semibold transition-colors duration-200">
            <span>Total Activities: <strong className="text-slate-700 dark:text-gray-300">{totalActivities} events</strong></span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200/50 dark:bg-slate-800 dark:border-slate-700/50" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-200/50 dark:bg-emerald-950/40 dark:border-emerald-900/40" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-300 border border-emerald-400/50 dark:bg-emerald-800/60 dark:border-emerald-700/50" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-600/50 dark:bg-emerald-650/50 dark:border-emerald-550/40" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-700 border border-emerald-800/50 dark:bg-emerald-500 dark:border-emerald-400/50" />
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;
