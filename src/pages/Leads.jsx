import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, LayoutGrid, List, X } from 'lucide-react';
import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import { useLeads } from '../hooks/useLeads';
import { useNotification } from '../context/NotificationContext';

/**
 * Leads Page Component
 * Serves as the state manager and presentation coordinator for all CRM lead management
 * tasks. Supports creating, reading, updating, and deleting leads locally with filter views.
 *
 * @returns {React.JSX.Element} The rendered Leads page.
 */
const Leads = () => {
  // Global context state for leads
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const { addNotification } = useNotification();

  // State: Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State: Currently selected lead for edit mode (null when creating a new lead)
  const [selectedLead, setSelectedLead] = useState(null);

  // State: Display view mode (grid vs table) for desktop layout
  const [viewMode, setViewMode] = useState('table');

  // State: Search & filter selectors
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  /**
   * Action handler: Opens form in CREATE mode
   */
  const handleOpenCreateModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  /**
   * Action handler: Opens form in EDIT mode with initial data loaded
   * @param {Object} lead - The lead to edit.
   */
  const handleOpenEditModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  /**
   * Action handler: Closes the active form modal and resets context
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Handle keyboard listener to close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  /**
   * CRUD Coordinator: Handles both CREATE (new lead) and UPDATE (edit lead) saves
   * @param {Object} formData - Form submission output.
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Check if status changed
      const isStatusChanged = selectedLead.status !== formData.status;
      updateLead(selectedLead.id, formData);
      if (isStatusChanged) {
        addNotification(`Lead ${formData.name} (${formData.company}) status updated to ${formData.status}`, 'info');
      } else {
        addNotification(`Updated profile details for lead: ${formData.name}`, 'info');
      }
    } else {
      // Create new lead using context
      addLead(formData);
      addNotification(`New lead captured: ${formData.name} (${formData.company})`, 'success');
    }
    handleCloseModal();
  };

  /**
   * CRUD Coordinator: Handles DELETE operations with toast notice feedback
   * @param {number|string} leadId - The unique ID of the target lead.
   */
  const handleDeleteLead = (leadId) => {
    const targetLead = leads.find((l) => l.id === leadId);
    const leadName = targetLead ? targetLead.name : 'Lead';
    const leadCompany = targetLead ? ` (${targetLead.company})` : '';

    deleteLead(leadId);
    addNotification(`Deleted lead: ${leadName}${leadCompany}`, 'danger');
  };

  // Filter leads based on active filter and search query
  const filteredLeads = leads
    .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
    .filter((lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-205">Leads Manager</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 transition-colors duration-205">
            Create, update, search, and organize CRM prospects throughout your sales pipeline.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <Plus size={16} /> Add New Lead
        </button>
      </div>

      {/* Filter, Search, and Layout Toolbar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-slate-200/80 dark:border-gray-700 shadow-sm flex flex-col gap-4 transition-colors duration-200">
        {/* Row 1: Search and Layout Toggles */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Tablet Hybrid ViewMode Switcher (hidden on mobile and desktop) */}
          <div className="hidden md:flex lg:hidden items-center gap-1.5 bg-slate-100 dark:bg-gray-900 p-1 rounded-xl transition-colors duration-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-850 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="Card Grid Mode"
              aria-label="Switch to Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-850 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="Table Directory Mode"
              aria-label="Switch to Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Row 2: Status filters */}
        <div className="pt-2 border-t border-slate-100 dark:border-gray-750">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            leads={leads}
          />
        </div>
      </div>

      {/* Main View Area: Responsive Layout Grid / Table */}
      <div>
        {filteredLeads.length === 0 ? (
          <EmptyState
            totalCount={leads.length}
            onClear={() => {
              setSearchQuery('');
              setActiveFilter('All');
            }}
          />
        ) : (
          <>
            {/* Mobile View: Cards stack in 1 column (visible on < md) */}
            <div className="block md:hidden">
              <div className="grid grid-cols-1 gap-6">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteLead}
                  />
                ))}
              </div>
            </div>

            {/* Tablet View: Toggleable hybrid (visible on md to lg) */}
            <div className="hidden md:block lg:hidden">
              {viewMode === 'table' ? (
                <LeadTable
                  leads={filteredLeads}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteLead}
                />
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {filteredLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onEdit={handleOpenEditModal}
                      onDelete={handleDeleteLead}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop View: Always Table View (visible on lg+) */}
            <div className="hidden lg:block">
              <LeadTable
                leads={filteredLeads}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteLead}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal Popup Container containing LeadForm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
            role="presentation"
          />

          {/* Modal Content Dialog */}
          <div
            className="relative w-full h-full md:h-auto md:max-w-lg bg-white dark:bg-gray-800 rounded-none md:rounded-2xl shadow-2xl p-6 z-10 overflow-y-auto max-h-screen md:max-h-[90vh] transition-all transform scale-100 duration-300 border-0 md:border border-slate-100 dark:border-gray-700"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button X Icon */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-400 dark:text-gray-550 hover:text-slate-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Embedded Form */}
            <LeadForm
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
