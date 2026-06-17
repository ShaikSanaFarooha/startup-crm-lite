import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      {/* Main Container */}
      <div className="max-w-md w-full text-center relative z-10 space-y-8">
        <div className="relative">
          {/* Compass Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/10 animate-bounce mb-6">
            <Compass size={48} className="animate-spin-slow" />
          </div>
          <div className="absolute -top-1 right-1/3 text-amber-400">
            <AlertCircle size={20} className="animate-pulse" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="space-y-3">
          <h1 className="text-8xl font-black bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent select-none tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-200">Lost in the Pipeline?</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            The page you are looking for doesn't exist, has been archived, or moved to a different pipeline status. Let's get you back on track!
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-xl transition-all duration-200"
          >
            <Home size={16} /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
