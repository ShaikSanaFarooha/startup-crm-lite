import React from 'react';
import { Pencil, Trash2, Mail, Phone, Calendar, Tag } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {number|string} id - Lead identifier.
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} [phone] - Phone number.
 * @property {string} status - Pipeline stage (e.g. 'New', 'Won').
 * @property {string} source - Lead origin source.
 * @property {string} [value] - Estimated financial value.
 * @property {string} date - Added timestamp.
 */

/**
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads - List of leads to render inside the table.
 * @property {function(Lead): void} onEdit - Callback when edit operation is clicked.
 * @property {function(number|string): void} onDelete - Callback when delete operation is clicked.
 */

/**
 * LeadTable Component
 * Renders a full tabular list of leads designed for desktop screens, with column
 * headers, status indicators, and actions for each entry.
 *
 * @param {LeadTableProps} props - The component props.
 * @returns {React.JSX.Element} The rendered LeadTable component.
 */
const LeadTable = ({ leads = [], onEdit, onDelete }) => {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
        <p className="text-base font-semibold">No active leads match your search criteria</p>
        <p className="text-xs mt-1">Try resetting the filters or creating a new lead entry.</p>
      </div>
    );
  }

  /**
   * Safe date formatter
   * @param {string} dateStr - Date string.
   * @returns {string} Human-readable date.
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200/60 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Company</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Email / Phone</th>
              <th className="py-4 px-6">Source</th>
              <th className="py-4 px-6">Date Added</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                {/* Contact Name & Value */}
                <td className="py-4 px-6">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {lead.name}
                  </div>
                  {lead.value && (
                    <div className="text-xs text-blue-600 font-bold mt-0.5">{lead.value}</div>
                  )}
                </td>

                {/* Company Name */}
                <td className="py-4 px-6 text-slate-600 font-semibold">
                  {lead.company}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <StatusBadge status={lead.status} />
                </td>

                {/* Email / Phone */}
                <td className="py-4 px-6">
                  <div className="flex flex-col space-y-0.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail size={12} className="text-slate-400" />
                      <a href={`mailto:${lead.email}`} className="hover:underline text-slate-600">
                        {lead.email}
                      </a>
                    </span>
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" />
                        <a href={`tel:${lead.phone}`} className="hover:underline text-slate-600">
                          {lead.phone}
                        </a>
                      </span>
                    )}
                  </div>
                </td>

                {/* Lead Source */}
                <td className="py-4 px-6 text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Tag size={12} className="text-slate-400" />
                    {lead.source}
                  </span>
                </td>

                {/* Date Added */}
                <td className="py-4 px-6 text-slate-400 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(lead.date)}
                  </span>
                </td>

                {/* Actions column */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                      title="Edit Lead"
                      aria-label={`Edit ${lead.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(lead.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Delete Lead"
                      aria-label={`Delete ${lead.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
