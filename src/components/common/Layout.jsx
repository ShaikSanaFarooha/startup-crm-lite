import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import PageSkeleton from './PageSkeleton';
import DarkModeToggle from './DarkModeToggle';
import { useLeads } from '../../hooks/useLeads';
import { useSettings } from '../../context/SettingsContext';
import { useNotification } from '../../context/NotificationContext';
import toast from 'react-hot-toast';
import {
  Bell,
  Search,
  Settings,
  Menu,
  X,
  Check,
  Trash2,
  ArrowRight,
  User,
  Globe,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  Tag
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leads, addLead } = useLeads();
  const {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    currency,
    setCurrency,
    formatCurrency,
    getCurrencySymbol
  } = useSettings();
  
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  } = useNotification();

  // Navigation and Drawer States
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedSearchLead, setSelectedSearchLead] = useState(null);

  // References for close-on-click-away (fallback)
  const searchRef = useRef(null);

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

  // Filter leads dynamically for Search Bar Dropdown
  const searchResults = globalSearchQuery.trim()
    ? leads.filter((lead) =>
        lead.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(globalSearchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Relative time helper for notifications
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return 'Recent';
    }
  };

  // Generate 5 random mock leads and inject them
  const handleGenerateMockLeads = () => {
    const firstNames = ['Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'Lucas', 'Mason', 'Ethan', 'Chloe', 'Zoe'];
    const lastNames = ['Smith', 'Jones', 'Taylor', 'Brown', 'Wilson', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez'];
    const companies = ['Apex Media', 'Stellar Tech', 'Nova Solutions', 'Quantum Corp', 'Delta Labs', 'Vertex Inc', 'Cloudburst', 'Helios'];
    const sources = ['LinkedIn', 'Website', 'Referral', 'Instagram', 'Ads', 'Cold Email'];
    const statuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'];

    const baseOwners = ['Sarah', 'Alex', 'David'];

    for (let i = 0; i < 5; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const owner = baseOwners[Math.floor(Math.random() * baseOwners.length)];
      const value = Math.floor(Math.random() * 80000) + 10000;

      // Construct lead object
      const leadData = {
        name: `${fName} ${lName}`,
        company,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: `+91 99999${Math.floor(Math.random() * 90000) + 10000}`,
        status,
        source,
        value: `${value}`, // Stores numerical values as string, which leads manager parses
        owner
      };

      addLead(leadData);

      // Trigger notification
      addNotification(`New Lead Captured: ${leadData.name} (${company}) - Value: ${formatCurrency(value)}`, 'success');
    }

    toast.success('Successfully generated 5 new leads!');
  };

  // Reset all CRM leads & settings back to starting state
  const handleResetCRMData = () => {
    if (window.confirm('Are you sure you want to reset all CRM data and settings? This will clear all changes and reload the page.')) {
      localStorage.clear();
      toast.success('Database cleared! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-100 transition-colors duration-200 antialiased">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Main Screen Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
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
          <div className="flex items-center gap-2 md:gap-4 relative">
            
            {/* Search Bar Input Container */}
            <div ref={searchRef} className="hidden md:block relative">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-3.5 py-1.5 w-48 lg:w-64 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <Search size={16} className="text-slate-400 dark:text-gray-550" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500"
                />
                {globalSearchQuery && (
                  <button
                    onClick={() => setGlobalSearchQuery('')}
                    className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown Overlay */}
              {globalSearchQuery.trim() !== '' && (
                <>
                  {/* Invisible Backdrop to close dropdown on click away */}
                  <div
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setGlobalSearchQuery('')}
                  />
                  <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-white dark:bg-gray-800 border border-slate-200/90 dark:border-gray-700 rounded-2xl shadow-xl z-40 overflow-hidden py-2.5 transition-all duration-200">
                    <div className="px-4 py-1.5 border-b border-slate-100 dark:border-gray-700 text-xxs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Search Results</span>
                      <span>{searchResults.length} matches</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto mt-1 divide-y divide-slate-50 dark:divide-gray-750">
                      {searchResults.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-400 dark:text-gray-500 italic">
                          No leads matched your search query.
                        </div>
                      ) : (
                        searchResults.map((lead) => (
                          <button
                            key={lead.id}
                            onClick={() => {
                              setSelectedSearchLead(lead);
                              setGlobalSearchQuery('');
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-gray-750 transition-colors flex flex-col gap-0.5 cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                {lead.name}
                              </span>
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold shrink-0">
                                {formatCurrency(lead.value)}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-gray-405 truncate">
                              {lead.company} • {lead.email}
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Navigation shortcuts */}
                    <div className="border-t border-slate-100 dark:border-gray-700 mt-2 px-3 pt-2">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider px-1 mb-1">
                        Quick Links
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            navigate('/');
                            setGlobalSearchQuery('');
                          }}
                          className="px-2 py-1 text-[10px] font-bold text-center bg-slate-50 dark:bg-gray-900 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg text-slate-600 dark:text-gray-400 cursor-pointer transition-all"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            navigate('/leads');
                            setGlobalSearchQuery('');
                          }}
                          className="px-2 py-1 text-[10px] font-bold text-center bg-slate-50 dark:bg-gray-900 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg text-slate-600 dark:text-gray-400 cursor-pointer transition-all"
                        >
                          Leads
                        </button>
                        <button
                          onClick={() => {
                            navigate('/analytics');
                            setGlobalSearchQuery('');
                          }}
                          className="px-2 py-1 text-[10px] font-bold text-center bg-slate-50 dark:bg-gray-900 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg text-slate-600 dark:text-gray-400 cursor-pointer transition-all"
                        >
                          Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 transition-all relative min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Open notifications center"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 min-w-[14px] h-[14px] bg-blue-600 text-white text-[9px] font-black flex items-center justify-center rounded-full px-0.5 border border-white dark:border-gray-800 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Popover */}
              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 border border-slate-200/90 dark:border-gray-700 rounded-2xl shadow-xl z-40 overflow-hidden py-3 transition-all duration-200">
                    <div className="px-4 pb-2 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">System Alerts</h4>
                        <span className="bg-slate-100 dark:bg-gray-900 text-slate-500 dark:text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          {unreadCount} unread
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={() => {
                              markAllAsRead();
                              toast.success('Marked all as read');
                            }}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={() => {
                              clearAll();
                              toast.error('Cleared notification feed');
                            }}
                            className="text-[10px] font-bold text-red-500 hover:text-red-600 cursor-pointer"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto mt-2 divide-y divide-slate-50 dark:divide-gray-750">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-slate-400 dark:text-gray-500 italic">
                          No notifications to show.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 flex gap-3 items-start transition-colors ${
                              notif.isRead ? 'opacity-70' : 'bg-blue-50/20 dark:bg-blue-900/5'
                            }`}
                          >
                            {/* Type Indicator */}
                            <span
                              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                notif.type === 'success'
                                  ? 'bg-green-500'
                                  : notif.type === 'warning'
                                  ? 'bg-amber-500'
                                  : notif.type === 'danger'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                              }`}
                            />

                            {/* Message Details */}
                            <div className="flex-1 space-y-1">
                              <p className="text-xs text-slate-700 dark:text-gray-200 font-semibold leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium">
                                  {formatRelativeTime(notif.timestamp)}
                                </span>
                                {!notif.isRead && (
                                  <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
                                  >
                                    <Check size={10} /> Mark read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Open settings drawer"
            >
              <Settings size={18} className="hover:rotate-45 transition-transform duration-300" />
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

      {/* Settings Panel Slide-over Drawer */}
      {isSettingsOpen && (
        <>
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 z-45 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsSettingsOpen(false)}
          />

          {/* Settings Drawer Content */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transition-transform transform duration-300">
            
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Settings className="text-blue-600 dark:text-blue-400" size={20} />
                  <h3 className="font-bold text-lg">CRM Console Settings</h3>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-750 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Input fields */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                    User Profile
                  </label>
                  <div className="bg-slate-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-slate-100 dark:border-gray-750 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xxs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide block">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white dark:bg-gray-850 border border-slate-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xxs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white dark:bg-gray-850 border border-slate-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Currency select */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                    Currency Preference
                  </label>
                  <div className="bg-slate-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-slate-100 dark:border-gray-750 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-gray-300 font-semibold flex items-center gap-1.5">
                        <Globe size={14} className="text-slate-400" />
                        Display Currency:
                      </span>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-white dark:bg-gray-850 border border-slate-200 dark:border-gray-700 text-xs font-bold py-1 px-2.5 rounded-lg outline-none cursor-pointer text-slate-800 dark:text-white"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 leading-normal">
                      Dynamically updates deal formatting, total values, velocity charts, and forecast predictions across all pages.
                    </p>
                  </div>
                </div>

                {/* Data utilities */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                    Database Utilities
                  </label>
                  <div className="bg-slate-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-slate-100 dark:border-gray-750 flex flex-col gap-2.5">
                    <button
                      onClick={handleGenerateMockLeads}
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer border border-blue-100 dark:border-blue-900/30"
                    >
                      <PlusCircle size={14} /> Generate 5 Mock Leads
                    </button>
                    <p className="text-[9px] text-slate-400 dark:text-gray-550 leading-relaxed -mt-1 px-1">
                      Injects 5 randomized leads into your pipeline with unique status stages, values, and owner reps. Will log items to system alerts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Settings Footer */}
            <div className="border-t border-slate-100 dark:border-gray-700 pt-4 mt-6">
              <button
                onClick={handleResetCRMData}
                className="w-full inline-flex items-center justify-center gap-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold py-2 border border-red-200/50 dark:border-red-900/30 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw size={14} /> Clear Cache & Reset CRM
              </button>
            </div>
          </div>
        </>
      )}

      {/* Global Lead Search Result Detail Modal */}
      {selectedSearchLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedSearchLead(null)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 z-10 overflow-y-auto max-h-[90vh] border border-slate-100 dark:border-gray-700 flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest block">
                    Lead Details
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedSearchLead.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSearchLead(null)}
                  className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Details table grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-gray-900/40 p-3 rounded-xl border border-slate-100/80 dark:border-gray-750">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide block">
                      Company
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-1 block">
                      {selectedSearchLead.company}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-900/40 p-3 rounded-xl border border-slate-100/80 dark:border-gray-750">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-gray-550 uppercase tracking-wide block">
                      Deal Value
                    </span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 mt-1 block">
                      {formatCurrency(selectedSearchLead.value)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-gray-900/40 p-3 rounded-xl border border-slate-100/80 dark:border-gray-750 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${selectedSearchLead.email}`}
                      className="text-slate-700 dark:text-gray-300 hover:underline truncate"
                    >
                      {selectedSearchLead.email}
                    </a>
                  </div>
                  {selectedSearchLead.phone && (
                    <div className="flex items-center gap-2 text-xs border-t border-slate-100 dark:border-gray-700/50 pt-2">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      <a
                        href={`tel:${selectedSearchLead.phone}`}
                        className="text-slate-700 dark:text-gray-300 hover:underline"
                      >
                        {selectedSearchLead.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-gray-700">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide block">
                      Pipeline Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white mt-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          selectedSearchLead.status === 'Won'
                            ? 'bg-green-500'
                            : selectedSearchLead.status === 'Lost'
                            ? 'bg-red-500'
                            : selectedSearchLead.status === 'Proposal Sent'
                            ? 'bg-purple-600'
                            : selectedSearchLead.status === 'Meeting Scheduled'
                            ? 'bg-amber-500'
                            : selectedSearchLead.status === 'Contacted'
                            ? 'bg-blue-600'
                            : 'bg-slate-400'
                        }`}
                      />
                      {selectedSearchLead.status}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-gray-700">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide block">
                      Lead Owner
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300 mt-1.5 block">
                      {selectedSearchLead.owner || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-gray-500 font-semibold px-1">
                  <span className="flex items-center gap-1">
                    <Tag size={10} />
                    Source: {selectedSearchLead.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    Added: {new Date(selectedSearchLead.createdAt || selectedSearchLead.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit redirect option */}
            <div className="border-t border-slate-100 dark:border-gray-700 pt-4 mt-6">
              <button
                onClick={() => {
                  setSelectedSearchLead(null);
                  navigate('/leads');
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
              >
                Go to Leads Manager to edit <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
