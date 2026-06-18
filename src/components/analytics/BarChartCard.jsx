import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { THEME_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const BarChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();
  const totalLeads = data.reduce((sum, item) => sum + item.count, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const year = payload[0].payload.year ? `, ${payload[0].payload.year}` : '';
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border border-slate-800">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}{year}</p>
          <p className="mt-0.5 text-white font-black text-sm">
            {payload[0].value} {payload[0].value === 1 ? 'Lead' : 'Leads'}
          </p>
        </div>
      );
    }
    return null;
  };

  const gridStroke = isDarkMode ? '#334155' : '#E2E8F0';
  const cursorFill = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Title & Info */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Lead Capture</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400">Prospect acquisition trends categorized by creation month</p>
      </div>

      {totalLeads === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-gray-500">
          No data available
        </div>
      ) : (
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={THEME_COLORS.primary} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={THEME_COLORS.primary} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill, radius: 8 }} />
              <Bar
                dataKey="count"
                fill="url(#barBlueGrad)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
                animationBegin={100}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BarChartCard;
