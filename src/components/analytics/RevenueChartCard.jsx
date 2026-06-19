import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { THEME_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

export const RevenueChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();
  const { formatCurrency, getCurrencySymbol } = useSettings();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const year = payload[0].payload.year ? `, ${payload[0].payload.year}` : '';
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border border-slate-800">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}{year} Revenue</p>
          <p className="mt-0.5 text-emerald-400 font-black text-sm">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const hasRevenue = data && data.some(item => item.revenue > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Title & Info */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Won Revenue Growth</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400">Monthly breakdown of won transaction values in pipeline</p>
      </div>

      {!hasRevenue ? (
        <div className="h-64 flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-gray-500">
          No won revenue recorded in this period
        </div>
      ) : (
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaGreenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={THEME_COLORS.success} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={THEME_COLORS.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: 600 }}
                tickFormatter={(val) => `${getCurrencySymbol()}${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={THEME_COLORS.success}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#areaGreenGrad)"
                animationBegin={100}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RevenueChartCard;
