import React from 'react';

/**
 * @typedef {Object} Lead
 * @property {number|string} id - The lead identifier.
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} status - Pipeline status (New, Contacted, In Progress, Qualified).
 * @property {string} value - Deal value string (e.g., "$15,000").
 * @property {string} date - Creation date.
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - Array of CRM leads.
 */

/**
 * PipelineOverview Component
 * Renders a horizontal, multi-segmented progress bar showing the distribution
 * of leads across different stages of the sales pipeline, with interactive metrics.
 *
 * @param {PipelineOverviewProps} props - The component props.
 * @returns {React.JSX.Element} The rendered PipelineOverview component.
 */
const PipelineOverview = ({ leads = [] }) => {
  // Safe handling of empty leads array
  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-center items-center h-64">
        <p className="text-sm text-slate-400 font-medium">No pipeline data available</p>
      </div>
    );
  }

  // Define status metadata with colors matching requirements
  const statusConfig = {
    'New': {
      label: 'New',
      color: '#2563EB', // Primary Blue
      bgClass: 'bg-blue-600',
      textClass: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-100 text-blue-700'
    },
    'Contacted': {
      label: 'Contacted',
      color: '#8B5CF6', // Purple/Indigo
      bgClass: 'bg-purple-600',
      textClass: 'text-purple-600',
      badgeBg: 'bg-purple-50 border-purple-100 text-purple-700'
    },
    'In Progress': {
      label: 'In Progress',
      color: '#F59E0B', // Warning Amber
      bgClass: 'bg-amber-500',
      textClass: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-100 text-amber-700'
    },
    'Qualified': {
      label: 'Qualified',
      color: '#22C55E', // Success Green
      bgClass: 'bg-green-500',
      textClass: 'text-green-600',
      badgeBg: 'bg-green-50 border-green-100 text-green-700'
    }
  };

  // Helper to parse currency values to floats
  const parseValue = (valStr) => {
    if (typeof valStr === 'number') return valStr;
    if (!valStr) return 0;
    return Number(valStr.replace(/[^0-9.-]+/g, '')) || 0;
  };

  // Count leads and sum up deals per status
  const summaryMap = leads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    if (!acc[status]) {
      acc[status] = { count: 0, totalValue: 0 };
    }
    acc[status].count += 1;
    acc[status].totalValue += parseValue(lead.value);
    return acc;
  }, {});

  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + parseValue(lead.value), 0);

  // Map to structured display segments
  const segments = Object.entries(statusConfig).map(([statusKey, config]) => {
    const stats = summaryMap[statusKey] || { count: 0, totalValue: 0 };
    const percentage = totalLeads > 0 ? (stats.count / totalLeads) * 100 : 0;
    return {
      statusKey,
      ...config,
      count: stats.count,
      totalValue: stats.totalValue,
      percentage: parseFloat(percentage.toFixed(1))
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      {/* Title & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Pipeline Overview</h3>
          <p className="text-xs text-slate-400">Proportional distribution of active leads across stages</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-sm font-semibold text-slate-800">
            Total Value: <span className="text-blue-600 font-bold">${totalValue.toLocaleString()}</span>
          </div>
          <div className="text-xs text-slate-400">Across {totalLeads} active leads</div>
        </div>
      </div>

      {/* Segmented Horizontal Bar Visualizer */}
      <div className="space-y-2">
        <div className="flex h-5 w-full rounded-full overflow-hidden bg-slate-100 shadow-inner">
          {segments.map((segment) => {
            if (segment.count === 0) return null;
            return (
              <div
                key={segment.statusKey}
                style={{ width: `${segment.percentage}%` }}
                className={`${segment.bgClass} hover:opacity-90 transition-opacity duration-200 relative group cursor-pointer`}
                title={`${segment.label}: ${segment.count} leads (${segment.percentage}%)`}
              >
                {/* Micro-glow effect on hover */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Legend & Statistics Card Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {segments.map((segment) => {
          const hasLeads = segment.count > 0;
          return (
            <div
              key={segment.statusKey}
              className={`p-3 rounded-xl border transition-all duration-300 ${
                hasLeads
                  ? 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-sm'
                  : 'border-slate-100/50 bg-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${segment.bgClass}`} />
                <span className="text-xs font-semibold text-slate-600">{segment.label}</span>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-bold text-slate-800 flex items-baseline gap-1">
                  {segment.count}
                  <span className="text-xxs font-medium text-slate-400">
                    ({segment.percentage}%)
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-500">
                  ${segment.totalValue.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineOverview;
