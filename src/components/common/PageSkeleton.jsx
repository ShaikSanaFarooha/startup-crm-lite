import React from 'react';

const PageSkeleton = () => {
  return (
    <div className="w-full min-h-screen p-6 bg-slate-50/50 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-slate-200 rounded-2xl p-6 space-y-3">
          <div className="h-4 w-12 bg-slate-300 rounded"></div>
          <div className="h-8 w-24 bg-slate-300 rounded"></div>
        </div>
        <div className="h-32 bg-slate-200 rounded-2xl p-6 space-y-3">
          <div className="h-4 w-12 bg-slate-300 rounded"></div>
          <div className="h-8 w-24 bg-slate-300 rounded"></div>
        </div>
        <div className="h-32 bg-slate-200 rounded-2xl p-6 space-y-3">
          <div className="h-4 w-12 bg-slate-300 rounded"></div>
          <div className="h-8 w-24 bg-slate-300 rounded"></div>
        </div>
      </div>

      {/* Large Content Section Skeleton */}
      <div className="h-96 bg-slate-200 rounded-2xl w-full"></div>
    </div>
  );
};

export default PageSkeleton;
