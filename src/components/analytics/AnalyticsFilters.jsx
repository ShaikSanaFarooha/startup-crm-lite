import React from 'react';
import { Calendar } from 'lucide-react';

export const AnalyticsFilters = ({ filterType, setFilterType, customRange, setCustomRange }) => {
  const options = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCustomRange((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-2 border-b border-slate-200/50 dark:border-gray-700/50 transition-colors duration-200">
      {/* Title & Description Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-gray-450 mt-1">
          Track sales performance, pipeline health, conversion trends, and growth forecasting.
        </p>
      </div>

      {/* Date Filter Tabs & Inputs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Selector pills */}
        <div className="inline-flex bg-slate-100 dark:bg-gray-950/60 p-1 rounded-xl border border-slate-200/50 dark:border-gray-800 self-start sm:self-auto overflow-x-auto max-w-full transition-colors duration-200">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === opt.value
                  ? 'bg-white dark:bg-gray-850 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom date range inputs */}
        {filterType === 'custom' && (
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-3 py-1.5 shadow-sm text-xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <Calendar size={14} className="text-slate-400 dark:text-gray-550" />
            <input
              type="date"
              name="start"
              value={customRange.start || ''}
              onChange={handleDateChange}
              className="bg-transparent border-none outline-none text-slate-700 dark:text-gray-200 w-28 cursor-pointer"
              aria-label="Start Date"
            />
            <span className="text-slate-400 dark:text-gray-550 font-medium px-0.5">to</span>
            <input
              type="date"
              name="end"
              value={customRange.end || ''}
              onChange={handleDateChange}
              className="bg-transparent border-none outline-none text-slate-700 dark:text-gray-200 w-28 cursor-pointer"
              aria-label="End Date"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsFilters;
