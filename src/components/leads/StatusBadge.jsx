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
    'New': 'bg-slate-100 text-slate-700 border-slate-200',
    'Contacted': 'bg-blue-50 text-blue-700 border-blue-100',
    'Meeting Scheduled': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Proposal Sent': 'bg-amber-50 text-amber-700 border-amber-100',
    'Won': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Lost': 'bg-red-50 text-red-700 border-red-100'
  };

  const activeStyle = stylesMap[status] || 'bg-slate-50 text-slate-600 border-slate-100';

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
