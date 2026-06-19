import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

/**
 * @typedef {Object} Lead
 * @property {number|string} [id] - Lead identifier (present in edit mode).
 * @property {string} name - Lead contact name.
 * @property {string} company - Lead company name.
 * @property {string} email - Lead email address.
 * @property {string} [phone] - Lead phone number.
 * @property {string} status - Pipeline stage.
 * @property {string} source - Lead acquisition source.
 * @property {string|number} [value] - Deal value (e.g. 12000).
 * @property {string} [date] - ISO/UTC date string when lead was added.
 */

/**
 * @typedef {Object} LeadFormProps
 * @property {Lead} [initialData] - The initial lead details for editing.
 * @property {function(Lead): void} onSubmit - Callback when form is successfully submitted.
 * @property {function(): void} onCancel - Callback when form edit/creation is cancelled.
 */

/**
 * LeadForm Component
 * Renders a full React form designed for creating and updating CRM leads.
 * Implements strict HTML validation, client-side format validation, and custom styling.
 *
 * @param {LeadFormProps} props - Component props.
 * @returns {React.JSX.Element} The rendered LeadForm component.
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const { getCurrencySymbol, parseNumericValue } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
    value: '0'
  });

  const [errors, setErrors] = useState({});

  // Sync state with initial data if passed in (e.g., when editing)
  useEffect(() => {
    if (initialData) {
      const valNum = parseNumericValue(initialData.value);
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
        value: valNum ? valNum.toLocaleString() : '0'
      });
    }
  }, [initialData]);

  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  /**
   * Universal change handler for controlled form inputs
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - Change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Live validation error clearing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Form submit coordinator and validator
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = 'Contact name is required.';
    }

    // Validate Company
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required.';
    }

    // Validate Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    // Validate Phone (optional but formats check if filled)
    if (formData.phone.trim()) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number (min 7 digits).';
      }
    }

    // Handle pipeline value formatting
    const parsedValue = parseNumericValue(formData.value);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      value: parsedValue
    });
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-1 pb-2 border-b border-slate-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-slate-950 dark:text-white">
          {isEditMode ? 'Edit Lead Profile' : 'Capture New Prospect'}
        </h3>
        <p className="text-xs text-slate-400 dark:text-gray-400">
          Fields marked with an asterisk (*) are mandatory.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name Input */}
        <div className="space-y-1">
          <label htmlFor="lead-name" className="text-xs font-semibold text-slate-600 dark:text-gray-300 block">
            Contact Name *
          </label>
          <input
            id="lead-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sana Watson"
            className={`w-full px-3.5 py-3 md:py-2 text-sm border rounded-xl outline-none transition-all min-h-[44px] md:min-h-0 ${
              errors.name
                ? 'border-red-300 dark:border-red-500 bg-white dark:bg-gray-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-red-500/15 focus:border-red-500'
                : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500'
            }`}
          />
          {errors.name && <p className="text-xxs text-red-600 font-medium">{errors.name}</p>}
        </div>

        {/* Company Input */}
        <div className="space-y-1">
          <label htmlFor="lead-company" className="text-xs font-semibold text-slate-600 dark:text-gray-300 block">
            Company Name *
          </label>
          <input
            id="lead-company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Acme Corporation"
            className={`w-full px-3.5 py-3 md:py-2 text-sm border rounded-xl outline-none transition-all min-h-[44px] md:min-h-0 ${
              errors.company
                ? 'border-red-300 dark:border-red-500 bg-white dark:bg-gray-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-red-500/15 focus:border-red-500'
                : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500'
            }`}
          />
          {errors.company && (
            <p className="text-xxs text-red-600 font-medium">{errors.company}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-1">
          <label htmlFor="lead-email" className="text-xs font-semibold text-slate-600 dark:text-gray-300 block">
            Email Address *
          </label>
          <input
            id="lead-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. name@company.com"
            className={`w-full px-3.5 py-3 md:py-2 text-sm border rounded-xl outline-none transition-all min-h-[44px] md:min-h-0 ${
              errors.email
                ? 'border-red-300 dark:border-red-500 bg-white dark:bg-gray-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-red-500/15 focus:border-red-500'
                : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500'
            }`}
          />
          {errors.email && <p className="text-xxs text-red-600 font-medium">{errors.email}</p>}
        </div>

        {/* Phone Input */}
        <div className="space-y-1">
          <label htmlFor="lead-phone" className="text-xs font-semibold text-slate-600 dark:text-gray-300 block">
            Phone Number
          </label>
          <input
            id="lead-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1 (555) 012-3456"
            className={`w-full px-3.5 py-3 md:py-2 text-sm border rounded-xl outline-none transition-all min-h-[44px] md:min-h-0 ${
              errors.phone
                ? 'border-red-300 dark:border-red-500 bg-white dark:bg-gray-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-red-500/15 focus:border-red-500'
                : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500'
            }`}
          />
          {errors.phone && <p className="text-xxs text-red-600 font-medium">{errors.phone}</p>}
        </div>

        {/* Pipeline Stage Select */}
        <div className="space-y-1">
          <label htmlFor="lead-status" className="text-xs font-semibold text-slate-600 dark:text-gray-300 block">
            Pipeline Stage
          </label>
          <select
            id="lead-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3.5 py-3 md:py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-slate-750 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all cursor-pointer min-h-[44px] md:min-h-0"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-gray-800">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Source Select */}
        <div className="space-y-1">
          <label htmlFor="lead-source" className="text-xs font-semibold text-slate-600 dark:text-gray-300 block">
            Lead Source
          </label>
          <select
            id="lead-source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-3.5 py-3 md:py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-slate-750 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all cursor-pointer min-h-[44px] md:min-h-0"
          >
            {sourceOptions.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-gray-800">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Pipeline Value Input */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="lead-value" className="text-xs font-semibold text-slate-600 dark:text-gray-300 block">
            Pipeline Estimated Value ({getCurrencySymbol()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 md:top-2 text-slate-400 dark:text-gray-500 text-sm font-bold">
              {getCurrencySymbol()}
            </span>
            <input
              id="lead-value"
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="0"
              className="w-full pl-8 pr-3.5 py-3 md:py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all min-h-[44px] md:min-h-0"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 md:py-2 text-sm font-semibold text-slate-600 dark:text-gray-350 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-xl transition-all cursor-pointer min-h-[44px] md:min-h-0 flex items-center justify-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-3 md:py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all cursor-pointer min-h-[44px] md:min-h-0 flex items-center justify-center"
        >
          {isEditMode ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
