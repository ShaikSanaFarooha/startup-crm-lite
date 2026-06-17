import React from 'react';
import { BarChart3, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Target, Award } from 'lucide-react';

const Analytics = () => {
  const metrics = [
    { name: 'Monthly Active leads', value: '458', change: '+14.2%', isPositive: true },
    { name: 'Average Response Time', value: '1.4 hrs', change: '-28.5%', isPositive: true }, // Negative response time is positive!
    { name: 'Client Acquisition Cost', value: '$124.50', change: '+3.1%', isPositive: false },
  ];

  const leadSources = [
    { source: 'Direct Search', value: 45, percentage: '45%', count: '240 leads', color: 'bg-blue-500' },
    { source: 'Referrals', value: 25, percentage: '25%', count: '133 leads', color: 'bg-indigo-500' },
    { source: 'Paid Campaigns', value: 18, percentage: '18%', count: '96 leads', color: 'bg-amber-500' },
    { source: 'Social Media', value: 12, percentage: '12%', count: '64 leads', color: 'bg-emerald-500' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Overview Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.name}</span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
                  ${m.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
              >
                {m.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {m.change}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Analytics Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Conversion Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">Sales & Qualified Funnel</h3>
            <p className="text-xs text-slate-400">Monthly breakdown of leads movement through status phases</p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Funnel Phase 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Phase 1: Captured Leads</span>
                <span className="text-slate-900">458 leads (100%)</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Funnel Phase 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Phase 2: Contacted Prospects</span>
                <span className="text-slate-900">320 leads (69.8%)</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '69.8%' }} />
              </div>
            </div>

            {/* Funnel Phase 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Phase 3: Active Discussions</span>
                <span className="text-slate-900">188 leads (41.0%)</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '41.0%' }} />
              </div>
            </div>

            {/* Funnel Phase 4 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Phase 4: Qualified Contracts</span>
                <span className="text-slate-900">111 leads (24.2%)</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '24.2%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Channels & Source Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">Lead Generation Channels</h3>
            <p className="text-xs text-slate-400">Which acquisition sources produce the most opportunities</p>
          </div>

          <div className="space-y-4 pt-2">
            {leadSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full ${source.color} flex-shrink-0`} />
                  <span className="font-semibold text-slate-700">{source.source}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className="font-semibold text-slate-900">{source.count}</span>
                  <span className="font-bold text-slate-400 min-w-10">{source.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Progress Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Target size={14} /> Quarter Target Goals
          </div>
          <h3 className="text-xl font-bold text-slate-900">Quarter Acquisition Progress</h3>
          <p className="text-sm text-slate-500">
            Our target for Q2 is 500 qualified conversions. With current growth metrics, we are on pace to exceed this by 8.4%.
          </p>
        </div>

        {/* Progress Ring Visual */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* SVG circle progress bar */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-blue-600 transition-all duration-500"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - 0.74)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-lg font-black text-slate-800">74%</span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-800">370 / 500 Leads</div>
            <div className="text-xs text-slate-400">Target reached so far this quarter</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              <Award size={12} /> High Velocity Pace
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
