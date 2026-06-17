import React from 'react';

/**
 * @typedef {Object} Lead
 * @property {number|string} id - The lead identifier.
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} status - Pipeline status (New, Contacted, In Progress, Qualified).
 * @property {string} value - Deal value string (e.g., "$15,000").
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
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Status style map matching standard CRM system style
  const statusStyles = {
    'New': 'bg-blue-50 text-blue-700 border-blue-100',
    'Contacted': 'bg-purple-50 text-purple-700 border-purple-100',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-100',
    'Qualified': 'bg-green-50 text-green-700 border-green-100'
  };

  /**
   * Format date string to a human-readable local date format
   * @param {string} dateString - YYYY-MM-DD date string.
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Recent Leads</h3>
          <p className="text-xs text-slate-400">Latest prospects added to the database</p>
        </div>
        <span className="text-xxs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
          Last 5 Entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Company</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead, idx) => (
                <tr key={lead.id || idx} className="hover:bg-slate-50/50 transition-colors duration-150">
                  <td className="py-3.5 px-2">
                    <div className="font-semibold text-slate-800">{lead.name}</div>
                    {lead.email && <div className="text-xs text-slate-400 font-normal">{lead.email}</div>}
                  </td>
                  <td className="py-3.5 px-2 text-slate-600 font-medium">
                    {lead.company}
                  </td>
                  <td className="py-3.5 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusStyles[lead.status] || 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right text-slate-500 text-xs font-medium">
                    {formatDate(lead.date)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400 text-sm">
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
