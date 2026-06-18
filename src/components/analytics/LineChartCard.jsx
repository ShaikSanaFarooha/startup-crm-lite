import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { THEME_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const LineChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const year = payload[0].payload.year ? `, ${payload[0].payload.year}` : '';
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border border-slate-800">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}{year}</p>
          <p className="mt-0.5 text-green-400 font-black text-sm">
            {payload[0].value}% Conversion
          </p>
        </div>
      );
    }
    return null;
  };

  const hasData = data && data.some(item => item.rate > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Title & Info */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Conversion Rate</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400">Ratio of won leads against total leads created per month</p>
      </div>

      {!hasData ? (
        <div className="h-64 flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-gray-500">
          No conversions recorded in this period
        </div>
      ) : (
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
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
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke={THEME_COLORS.success}
                strokeWidth={3}
                dot={{ r: 5, stroke: isDarkMode ? '#1E293B' : '#FFFFFF', strokeWidth: 2, fill: THEME_COLORS.success }}
                activeDot={{ r: 7, stroke: isDarkMode ? '#1E293B' : '#FFFFFF', strokeWidth: 2, fill: THEME_COLORS.success }}
                animationBegin={100}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LineChartCard;
