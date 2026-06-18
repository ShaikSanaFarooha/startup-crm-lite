import React from 'react';
import { Mail, Phone, Building2, Pencil, Trash2, Calendar, Tag } from 'lucide-react';
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
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead - The lead object to render.
 * @property {function(Lead): void} onEdit - Callback when editing is triggered.
 * @property {function(number|string): void} onDelete - Callback when deletion is triggered.
 */

/**
 * LeadCard Component
 * Displays individual lead details inside an interactive visual container,
 * with actions to trigger editing and deletion.
 *
 * @param {LeadCardProps} props - The component props.
 * @returns {React.JSX.Element} The rendered LeadCard component.
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group">
      {/* Top Header Section */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {lead.name}
          </h4>
          <StatusBadge status={lead.status} />
        </div>

        {/* Company and Value Row */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-gray-400">
          <Building2 size={13} className="text-slate-400 dark:text-gray-500 shrink-0" />
          <span className="truncate">{lead.company}</span>
          {lead.value && (
            <>
              <span className="text-slate-300 dark:text-slate-650">•</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{lead.value}</span>
            </>
          )}
        </div>
      </div>

      {/* Body Contact details */}
      <div className="space-y-1.5 text-xs text-slate-500 dark:text-gray-400 border-t border-b border-slate-50 dark:border-gray-700/50 py-3">
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-slate-400 dark:text-gray-550 shrink-0" />
          <a
            href={`mailto:${lead.email}`}
            className="hover:underline text-slate-600 dark:text-gray-300 truncate"
            title={lead.email}
          >
            {lead.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={13} className="text-slate-400 dark:text-gray-550 shrink-0" />
          {lead.phone ? (
            <a href={`tel:${lead.phone}`} className="hover:underline text-slate-600 dark:text-gray-300">
              {lead.phone}
            </a>
          ) : (
            <span className="text-slate-400 dark:text-gray-500 italic">No phone provided</span>
          )}
        </div>
      </div>

      {/* Footer Details and Actions */}
      <div className="flex items-center justify-between text-xxs font-medium text-slate-400 dark:text-gray-500">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Tag size={10} className="shrink-0" />
            <span>Source: {lead.source}</span>
          </div>
          {lead.date && (
            <div className="flex items-center gap-1">
              <Calendar size={10} className="shrink-0" />
              <span>Added: {lead.date}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(lead)}
            className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-xl text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all cursor-pointer"
            title="Edit Lead"
            aria-label={`Edit ${lead.name}`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-xl text-slate-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-pointer"
            title="Delete Lead"
            aria-label={`Delete ${lead.name}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
