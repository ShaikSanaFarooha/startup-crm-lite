import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Date Filter skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 bg-slate-200 rounded-lg w-48" />
          <div className="h-4 bg-slate-100 rounded-lg w-72" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-64" />
      </div>

      {/* KPI Cards Grid Skeleton - 6 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-slate-200 rounded w-16" />
              <div className="h-8 w-8 bg-slate-100 rounded-lg" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-7 bg-slate-200 rounded-md w-24" />
              <div className="h-3 bg-slate-150 rounded w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid Row 1 (Pie & Funnel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie/Doughnut Card Skeleton */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-slate-250 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
            <div className="h-36 w-36 rounded-full border-[12px] border-slate-100 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-slate-50" />
            </div>
            <div className="space-y-2 w-full max-w-[200px]">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-100 rounded w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel Card Skeleton */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-slate-250 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
          <div className="space-y-4 py-2">
            {[100, 80, 60, 40, 20].map((width, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-150 rounded w-12" />
                  <div className="h-3 bg-slate-200 rounded w-8" />
                </div>
                <div className="h-4 bg-slate-100 rounded-full w-full">
                  <div className="h-full bg-slate-200 rounded-full" style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2 (Bar & Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-slate-250 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
            <div className="h-48 bg-slate-50 rounded-xl flex items-end justify-between p-4 gap-4">
              {[40, 60, 30, 80, 50, 70, 45, 90].map((h, idx) => (
                <div key={idx} className="bg-slate-200 rounded-t w-full" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
