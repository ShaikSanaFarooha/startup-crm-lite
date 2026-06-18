import React, { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import PageSkeleton from './PageSkeleton';
import DarkModeToggle from './DarkModeToggle';
import { Bell, Search, Settings, Menu } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Helper to compute a page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/leads':
        return 'Lead Management';
      case '/analytics':
        return 'Performance Analytics';
      default:
        return 'CRM Console';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-100 transition-colors duration-200 antialiased">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Main Screen Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-slate-200/80 dark:border-gray-700 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/50 dark:shadow-none transition-colors duration-200">
          <div className="flex items-center gap-3">
            {/* Hamburger trigger on mobile */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2.5 rounded-xl text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Bar Placeholder */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-3.5 py-1.5 w-48 lg:w-64 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <Search size={16} className="text-slate-400 dark:text-gray-550" />
              <input
                type="text"
                placeholder="Search leads, tasks..."
                className="bg-transparent border-none outline-none text-xs w-full text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Notification Bell */}
            <button className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 transition-all relative min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border border-white dark:border-gray-800" />
            </button>

            {/* Settings Link */}
            <button className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic Route Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-gray-900/50 transition-colors duration-200 pb-20 md:pb-6">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
