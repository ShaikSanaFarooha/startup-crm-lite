import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';

// Renders expanded shape on hover
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      className="transition-all duration-300"
    />
  );
};

export const PieChartCard = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  // Calculate total leads
  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  // Filter out items with 0 count to keep visual clean
  const activeData = data.filter(item => item.value > 0);

  // Custom Tooltip Renderer
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const payloadData = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border border-slate-800">
          <p className="font-extrabold text-[11px] uppercase tracking-wider" style={{ color: payload[0].color }}>
            {payloadData.name}
          </p>
          <p className="mt-0.5 text-slate-200">
            {payloadData.value} {payloadData.value === 1 ? 'Lead' : 'Leads'}
          </p>
          <p className="text-slate-400 text-[10px]">
            {payloadData.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between transition-colors duration-200">
      {/* Title */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Lead Stage Distribution</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400">Total volume of prospects segmented by pipeline status</p>
      </div>

      {/* Main Content Area */}
      {totalLeads === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-gray-500">
          No data available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-4">
          {/* Doughnut Container with centered label */}
          <div className="relative w-full h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={activeData}
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="84%"
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {activeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || '#64748B'}
                      className="outline-none focus:outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Centered Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none transition-colors duration-200">
                {totalLeads}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mt-1 transition-colors duration-200">
                Total Leads
              </span>
            </div>
          </div>

          {/* Grid Legend Display */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2">
            {data.map((item, index) => {
              const color = STATUS_COLORS[item.name] || '#64748B';
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors text-xs font-semibold"
                  onMouseEnter={() => {
                    const idx = activeData.findIndex(d => d.name === item.name);
                    if (idx !== -1) setActiveIndex(idx);
                  }}
                  onMouseLeave={onPieLeave}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-slate-900 dark:text-white font-extrabold">{item.value}</span>
                    <span className="text-slate-400 dark:text-gray-500 font-medium text-[11px] min-w-10">({item.percentage}%)</span>
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

export default PieChartCard;
