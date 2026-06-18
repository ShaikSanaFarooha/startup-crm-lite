import React from 'react';

/**
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - The lead status value (e.g., 'New', 'Contacted', 'Won', 'Lost', etc.).
 */

/**
 * StatusBadge Component
 * Renders a pill-shaped badge with semantic styling matching the status of the lead.
 *
 * @param {StatusBadgeProps} props - The component props.
 * @returns {React.JSX.Element} The rendered StatusBadge component.
 */
const StatusBadge = ({ status }) => {
  // Map lead status keys to specific Tailwind styling profiles
  const stylesMap = {
    'New': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    'Contacted': 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
    'Meeting Scheduled': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
    'Proposal Sent': 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    'Won': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    'Lost': 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/50'
  };

  const activeStyle = stylesMap[status] || 'bg-slate-50 dark:bg-gray-850 text-slate-600 dark:text-gray-300 border-slate-100 dark:border-gray-750';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${activeStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
