import React from 'react';
import { UserPlus, Users, Download, ArrowUpRight } from 'lucide-react';

/**
 * @typedef {Object} QuickActionsProps
 * @property {function} onAddNewLead - Callback triggered when clicking "Add New Lead".
 * @property {function} onViewAllLeads - Callback triggered when clicking "View All Leads".
 * @property {function} onExportData - Callback triggered when clicking "Export Data".
 */

/**
 * QuickActions Component
 * Provides action card shortcuts for adding leads, navigating the directory,
 * and downloading reports with clean icons and hover micro-animations.
 *
 * @param {QuickActionsProps} props - The component props.
 * @returns {React.JSX.Element} The rendered QuickActions component.
 */
const QuickActions = ({ onAddNewLead, onViewAllLeads, onExportData }) => {
  const actions = [
    {
      title: 'Add New Lead',
      description: 'Add a new prospect to your sales pipeline',
      icon: UserPlus,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50 hover:bg-blue-100/50 dark:hover:bg-blue-900/60',
      arrowColor: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
      onClick: onAddNewLead
    },
    {
      title: 'View All Leads',
      description: 'Open full listing directory and detail filters',
      icon: Users,
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50 hover:bg-purple-100/50 dark:hover:bg-purple-900/60',
      arrowColor: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
      onClick: onViewAllLeads
    },
    {
      title: 'Export Data',
      description: 'Download CSV file of all pipeline leads',
      icon: Download,
      color: 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50 hover:bg-green-100/50 dark:hover:bg-green-900/60',
      arrowColor: 'group-hover:text-green-600 dark:group-hover:text-green-400',
      onClick: onExportData
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 shadow-sm p-6 space-y-6 transition-colors duration-200">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Quick Actions</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400">Shortcuts to manage your daily sales activities</p>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-3 lg:flex lg:flex-col gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-gray-750 hover:border-slate-200 dark:hover:border-gray-700 hover:shadow-sm text-left transition-all duration-200 group cursor-pointer bg-slate-50/50 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-850"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border transition-colors duration-200 ${action.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-gray-200">
                    {action.title}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-gray-450 max-w-[200px] truncate sm:max-w-none">
                    {action.description}
                  </div>
                </div>
              </div>
              <ArrowUpRight
                size={16}
                className={`text-slate-400 dark:text-gray-500 transition-colors duration-200 ${action.arrowColor}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
