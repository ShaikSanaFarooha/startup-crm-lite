import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Plus } from 'lucide-react';

export const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  const handleAddLeadClick = () => {
    navigate('/leads');
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-24 text-center bg-white border border-slate-200/80 rounded-2xl shadow-sm">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-6 shadow-sm shadow-blue-500/5 animate-pulse">
        <BarChart3 size={32} className="stroke-[2]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        No analytics available yet
      </h3>

      <p className="mt-3 text-sm text-slate-500 max-w-md leading-relaxed">
        Add your first lead to start tracking business performance, conversion ratios, sales velocity, and pipeline forecasting.
      </p>

      <button
        type="button"
        onClick={handleAddLeadClick}
        className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <Plus size={16} /> Add Lead
      </button>
    </div>
  );
};

export default EmptyAnalyticsState;
