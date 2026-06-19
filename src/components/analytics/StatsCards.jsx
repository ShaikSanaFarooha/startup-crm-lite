import React from 'react';
import { Users, Target, CircleDollarSign, Award, Clock, AlertOctagon, TrendingUp, TrendingDown } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const StatsCards = ({ metrics }) => {
  const { current, growth } = metrics;
  const { formatCurrency } = useSettings();

  const kpis = [
    {
      title: 'Total Leads',
      value: current.totalLeads.toLocaleString(),
      growth: growth.totalLeads,
      isPercentagePoints: false,
      isDays: false,
      isLowerBetter: false,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: `${current.conversionRate}%`,
      growth: growth.conversionRate,
      isPercentagePoints: true,
      isDays: false,
      isLowerBetter: false,
      icon: Target,
      color: 'green'
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(current.pipelineValue),
      growth: growth.pipelineValue,
      isPercentagePoints: false,
      isDays: false,
      isLowerBetter: false,
      icon: CircleDollarSign,
      color: 'amber'
    },
    {
      title: 'Won Revenue',
      value: formatCurrency(current.wonRevenue),
      growth: growth.wonRevenue,
      isPercentagePoints: false,
      isDays: false,
      isLowerBetter: false,
      icon: Award,
      color: 'emerald'
    },
    {
      title: 'Average Sales Cycle',
      value: `${current.avgSalesCycle} Days`,
      growth: growth.avgSalesCycle,
      isPercentagePoints: false,
      isDays: true,
      isLowerBetter: true, // Lower sales cycle is better
      icon: Clock,
      color: 'indigo'
    },
    {
      title: 'Lost Rate',
      value: `${current.lostRate}%`,
      growth: growth.lostRate,
      isPercentagePoints: true,
      isDays: false,
      isLowerBetter: true, // Lower lost rate is better
      icon: AlertOctagon,
      color: 'red'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        
        // Growth indicators formatting
        const isNeutral = kpi.growth === 0;
        let isPositiveEffect = false;
        
        if (kpi.isLowerBetter) {
          isPositiveEffect = kpi.growth < 0;
        } else {
          isPositiveEffect = kpi.growth > 0;
        }

        const absGrowth = Math.abs(kpi.growth);
        let growthText = '';
        if (isNeutral) {
          growthText = 'No change';
        } else {
          const prefix = kpi.growth > 0 ? '+' : '-';
          const suffix = kpi.isPercentagePoints ? 'pp' : kpi.isDays ? ' days' : '%';
          growthText = `${prefix}${absGrowth}${suffix}`;
        }

        // Color theme mappings
        const colorStyles = {
          blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50 shadow-blue-500/5',
          green: 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50 shadow-green-500/5',
          amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50 shadow-amber-500/5',
          emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50 shadow-emerald-500/5',
          indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50 shadow-indigo-500/5',
          red: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50 shadow-red-500/5'
        };

        const activeColorStyle = colorStyles[kpi.color] || colorStyles.blue;

        return (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl border ${activeColorStyle} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={16} className="stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight block">
                {kpi.value}
              </span>
              
              <div className="flex items-center gap-1.5 mt-2 text-xxs font-semibold">
                {isNeutral ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-800 text-slate-500 dark:text-gray-400">
                    {growthText}
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border ${
                      isPositiveEffect
                        ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50'
                        : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50'
                    }`}
                  >
                    {isPositiveEffect ? (
                      <TrendingUp size={10} className="stroke-[2.5]" />
                    ) : (
                      <TrendingDown size={10} className="stroke-[2.5]" />
                    )}
                    <span>{growthText}</span>
                  </span>
                )}
                <span className="text-slate-400 dark:text-slate-500 font-medium">vs prior period</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
