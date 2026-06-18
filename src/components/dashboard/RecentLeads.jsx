import React from 'react';

/**
 * @typedef {Object} Lead
 * @property {number|string} id - The lead identifier.
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} status - Pipeline status.
 * @property {string|number} value - Deal value string or number.
 * @property {string} date - Creation date (YYYY-MM-DD).
 * @property {string} [email] - Contact email address.
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - Array of leads.
 */

/**
 * RecentLeads Component
 * Displays the 5 most recently added leads in a clean, polished table layout
 * with styled status badges and date formatted outputs.
 *
 * @param {RecentLeadsProps} props - The component props.
 * @returns {React.JSX.Element} The rendered RecentLeads component.
 */
const RecentLeads = ({ leads = [] }) => {
  // Get the 5 most recent leads based on date (latest first)
  const recentLeads = [...leads]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return dateB - dateA;
    })
    .slice(0, 5);

  // Status style map matching standard CRM system style
  const statusStyles = {
    'New': 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700',
    'Contacted': 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
    'Meeting Scheduled': 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    'Proposal Sent': 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
    'Won': 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/50',
    'Lost': 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/50'
  };

  /**
   * Format date string to a human-readable local date format
   * @param {string} dateString - ISO or YYYY-MM-DD date string.
   * @returns {string} Formatted date.
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 shadow-sm p-6 space-y-6 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Leads</h3>
          <p className="text-xs text-slate-400 dark:text-gray-400">Latest prospects added to the database</p>
        </div>
        <span className="text-xxs font-bold px-2 py-1 bg-slate-100 dark:bg-gray-900 text-slate-500 dark:text-gray-450 rounded-lg transition-colors duration-200">
          Last 5 Entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-gray-700 text-slate-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Company</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-gray-750 text-sm">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead, idx) => (
                <tr key={lead.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-gray-750/30 transition-colors duration-150">
                  <td className="py-3.5 px-2">
                    <div className="font-semibold text-slate-800 dark:text-gray-200">{lead.name}</div>
                    {lead.email && <div className="text-xs text-slate-400 dark:text-gray-450 font-normal">{lead.email}</div>}
                  </td>
                  <td className="py-3.5 px-2 text-slate-600 dark:text-gray-300 font-medium">
                    {lead.company}
                  </td>
                  <td className="py-3.5 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusStyles[lead.status] || 'bg-slate-50 dark:bg-gray-900 text-slate-600 dark:text-gray-300 border-slate-100 dark:border-gray-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right text-slate-500 dark:text-gray-450 text-xs font-medium">
                    {formatDate(lead.createdAt || lead.date)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400 dark:text-gray-500 text-sm">
                  No recent leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
