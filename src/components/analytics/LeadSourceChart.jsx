import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SOURCE_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const LeadSourceChart = ({ data }) => {
  const { isDarkMode } = useTheme();
  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const payloadData = payload[0].payload;
      const pct = totalLeads ? Math.round((payloadData.value / totalLeads) * 100) : 0;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border border-slate-800">
          <p className="font-extrabold text-[11px] uppercase tracking-wider" style={{ color: SOURCE_COLORS[payloadData.name] || '#94A3B8' }}>
            {payloadData.name}
          </p>
          <p className="mt-0.5 text-white font-black text-sm">
            {payloadData.value} {payloadData.value === 1 ? 'Lead' : 'Leads'}
          </p>
          <p className="text-slate-400 text-[10px] mt-0.5">
            {pct}% of lead acquisition
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Title & Info */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Acquisition Channels</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400">Leads captured grouped by their generation source</p>
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
              layout="vertical"
              margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: 600 }}
                allowDecimals={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDarkMode ? '#E2E8F0' : '#475569', fontSize: 11, fontWeight: 700 }}
                width={75}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC', radius: 4 }} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
                animationBegin={100}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SOURCE_COLORS[entry.name] || '#64748B'}
                    className="outline-none focus:outline-none"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LeadSourceChart;
