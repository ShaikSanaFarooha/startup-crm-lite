import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, X, Zap } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: LayoutDashboard,
      subLabel: 'Overview & statistics'
    },
    { 
      name: 'Leads', 
      path: '/leads', 
      icon: Users,
      subLabel: 'Pipeline & operations'
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: BarChart3,
      subLabel: 'Business reports'
    },
  ];

  return (
    <>
      {/* 1. MOBILE BOTTOM NAVIGATION BAR (Icons Only, visible on < md) */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 z-40 flex items-center justify-around px-4 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer relative min-w-[44px] min-h-[44px]
                ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
              aria-label={item.name}
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} />
                  {isActive && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* 2. MOBILE SIDE DRAWER (Overlay + Slide-out Panel, visible on < md when isOpen) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <Zap size={20} className="animate-pulse" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                CRM Lite
              </span>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-6 px-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 group relative min-h-[44px]
                    ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 font-semibold'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full" />
                      )}
                      <Icon
                        size={18}
                        className={`transition-colors duration-200 ${
                          isActive
                            ? 'text-blue-500'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal mt-0.5">{item.subLabel}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
              SF
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-200 truncate">Sana Farooha</h4>
              <p className="text-[10px] text-slate-500 truncate">sana@startup.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 3. TABLET & DESKTOP LEFT SIDEBAR (w-20/w-64, visible on md+) */}
      <aside className="hidden md:flex flex-col justify-between bg-slate-900 border-r border-slate-800 text-slate-300 h-screen sticky top-0 transition-all duration-300 md:w-20 lg:w-64 shrink-0 z-30 select-none">
        <div>
          {/* Logo & Header */}
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800 overflow-hidden">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <Zap size={20} className="animate-pulse" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent hidden lg:block">
                CRM Lite
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 px-3 lg:px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3.5 py-2.5 px-2 lg:px-4 lg:py-3 rounded-xl transition-all duration-200 group relative min-h-[44px] justify-center lg:justify-start
                    ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 font-semibold'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full hidden lg:block" />
                      )}
                      <Icon
                        size={18}
                        className={`transition-colors duration-200 shrink-0 ${
                          isActive
                            ? 'text-blue-500'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <div className="flex flex-col items-center lg:items-start overflow-hidden">
                        {/* Text label: standard size on desktop, smaller/centered on tablet */}
                        <span className="text-[10px] lg:text-sm font-semibold tracking-wide truncate">
                          {item.name}
                        </span>
                        {/* Sub-label: visible on desktop, hidden on tablet */}
                        <span className="text-[10px] text-slate-500 font-normal hidden lg:block mt-0.5 truncate max-w-[170px]">
                          {item.subLabel}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 lg:p-4 border-t border-slate-800 bg-slate-950/20 overflow-hidden">
          <div className="flex items-center justify-center lg:justify-start gap-3 p-1 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
              SF
            </div>
            <div className="overflow-hidden hidden lg:block">
              <h4 className="text-xs font-semibold text-slate-200 truncate">Sana Farooha</h4>
              <p className="text-[10px] text-slate-500 truncate">sana@startup.io</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
