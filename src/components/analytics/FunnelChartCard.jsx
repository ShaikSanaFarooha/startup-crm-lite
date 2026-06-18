import React from 'react';
import { FunnelChart, Funnel, Cell, LabelList, ResponsiveContainer, Tooltip } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const FunnelChartCard = ({ data }) => {
  // Map funnel keys to match Recharts expected fields: name and value
  const chartData = data.map((item) => ({
    name: item.stage,
    value: item.count,
    conversion: item.conversion,
    dropoff: item.dropoff
  }));

  const totalLeads = chartData.length > 0 ? chartData[0].value : 0;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const payloadData = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border border-slate-800">
          <p className="font-extrabold text-[11px] uppercase tracking-wider" style={{ color: STATUS_COLORS[payloadData.name] }}>
            {payloadData.name}
          </p>
          <p className="mt-1 text-slate-100 font-bold">
            {payloadData.value} {payloadData.value === 1 ? 'Lead' : 'Leads'}
          </p>
          <div className="mt-1.5 pt-1.5 border-t border-slate-800 space-y-0.5 text-[10px] text-slate-400">
            <p>Conversion from Top: <span className="text-white font-bold">{payloadData.conversion}%</span></p>
            {payloadData.name !== 'New' && (
              <p>Stage Drop-off: <span className="text-rose-400 font-bold">{payloadData.dropoff}%</span></p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const { isDarkMode } = useTheme();
  const labelColor = isDarkMode ? '#94A3B8' : '#475569';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Title */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Sales Conversion Funnel</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400">Prospect progression and drop-off metrics through pipeline phases</p>
      </div>

      {totalLeads === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-gray-500">
          No data available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-4">
          {/* Recharts Funnel visualization */}
          <div className="col-span-1 md:col-span-2 h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                  data={chartData}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  <LabelList
                    position="right"
                    fill={labelColor}
                    stroke="none"
                    dataKey="name"
                    className="text-[10px] font-bold fill-slate-500 dark:fill-slate-400"
                  />
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`funnel-cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || '#64748B'}
                      className="outline-none focus:outline-none"
                    />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Tabular details with counts and percentage conversion */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {data.map((item, idx) => {
              const color = STATUS_COLORS[item.stage] || '#64748B';
              return (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-100 dark:border-gray-750 bg-slate-50/50 dark:bg-gray-900/40 text-xs flex flex-col gap-1 transition-colors duration-200">
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-slate-800 dark:text-gray-300">{item.stage}</span>
                    </div>
                    <span className="text-slate-900 dark:text-white font-extrabold">{item.count}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 dark:text-gray-500 font-semibold text-[10px] mt-0.5">
                    <span>Conversion: {item.conversion}%</span>
                    {item.stage !== 'New' && (
                      <span className="text-red-500/80 dark:text-red-400/85">Drop-off: {item.dropoff}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelChartCard;
