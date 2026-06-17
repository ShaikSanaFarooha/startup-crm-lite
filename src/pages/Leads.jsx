import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Filter, Plus, LayoutGrid, List, X } from 'lucide-react';
import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';

/**
 * Leads Page Component
 * Serves as the state manager and presentation coordinator for all CRM lead management
 * tasks. Supports creating, reading, updating, and deleting leads locally with filter views.
 *
 * @returns {React.JSX.Element} The rendered Leads page.
 */
const Leads = () => {
  // State: List of active CRM leads
  const [leads, setLeads] = useState([
    { id: 1, name: 'Emma Watson', company: 'Hogwarts Inc', email: 'emma@hogwarts.edu', phone: '+1 555-0199', value: '$15,000', status: 'Won', source: 'Referral', date: '2026-06-12' },
    { id: 2, name: 'John Doe', company: 'Global Tech', email: 'john@globaltech.com', phone: '+1 555-0123', value: '$8,200', status: 'Proposal Sent', source: 'Website', date: '2026-06-14' },
    { id: 3, name: 'Alice Smith', company: 'Apex Labs', email: 'alice@apexlabs.org', phone: '+1 555-0145', value: '$22,500', status: 'New', source: 'LinkedIn', date: '2026-06-15' },
    { id: 4, name: 'Bruce Wayne', company: 'Wayne Enterprises', email: 'bruce@wayne.com', phone: '+1 555-1939', value: '$120,000', status: 'Meeting Scheduled', source: 'Cold Call', date: '2026-06-01' },
    { id: 5, name: 'Clara Oswald', company: 'Time Travelers Ltd', email: 'clara@tardis.co', phone: '+1 555-1100', value: '$4,800', status: 'Contacted', source: 'Email Campaign', date: '2026-06-10' },
    { id: 6, name: 'Tony Stark', company: 'Stark Industries', email: 'tony@stark.com', phone: '+1 555-3000', value: '$95,000', status: 'Lost', source: 'Other', date: '2026-06-08' },
  ]);

  // State: Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State: Currently selected lead for edit mode (null when creating a new lead)
  const [selectedLead, setSelectedLead] = useState(null);

  // State: Display view mode (grid vs table) for desktop layout
  const [viewMode, setViewMode] = useState('table');

  // State: Search & filter selectors
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

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

  const statuses = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sources = ['All', 'Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

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

  /**
   * CRUD Coordinator: Handles both CREATE (new lead) and UPDATE (edit lead) saves
   * @param {Object} formData - Form submission output.
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Update existing lead
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === selectedLead.id ? { ...lead, ...formData } : lead
        )
      );
      toast.success('Lead details updated successfully!');
    } else {
      // Create new lead
      const newLead = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10)
      };
      setLeads((prevLeads) => [newLead, ...prevLeads]);
      toast.success('New lead captured successfully!');
    }
    handleCloseModal();
  };

  /**
   * CRUD Coordinator: Handles DELETE operations with toast notice feedback
   * @param {number|string} leadId - The unique ID of the target lead.
   */
  const handleDeleteLead = (leadId) => {
    // Find the lead name for a personalized notice
    const targetLead = leads.find((l) => l.id === leadId);
    const leadName = targetLead ? targetLead.name : 'Lead';

    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
    toast.error(`Removed lead: ${leadName}`);
  };

  // Filter leads based on active search terms, status, and source selectors
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone && lead.phone.includes(searchTerm));

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Leads Manager</h2>
          <p className="text-sm text-slate-500">
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
        {/* Row 1: Search and Layout Toggles */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 w-full md:max-w-md focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:border-blue-500 transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search name, company, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Desktop ViewMode Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid Mode"
              aria-label="Switch to Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table Directory Mode"
              aria-label="Switch to Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Row 2: Status & Source filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-slate-50 text-xs font-semibold text-slate-500">
          {/* Status Filters */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-slate-400 uppercase tracking-wider">Filter Stage:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg border font-medium transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === status
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Source Filters */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-slate-400 uppercase tracking-wider">Filter Source:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {sources.map((source) => (
                <button
                  key={source}
                  onClick={() => setSourceFilter(source)}
                  className={`px-3 py-1.5 rounded-lg border font-medium transition-all whitespace-nowrap cursor-pointer ${
                    sourceFilter === source
                      ? 'bg-purple-50 border-purple-200 text-purple-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area: Responsive Layout Grid / Table */}
      <div>
        {/* Mobile View: Cards stack in grid layout */}
        <div className="block lg:hidden">
          {filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              <p className="text-base font-semibold">No active leads match your filters</p>
              <p className="text-xs mt-1">Try resetting search keywords or status/source filters.</p>
            </div>
          )}
        </div>

        {/* Desktop View: Selectable between Card Grid or clean directory list Table */}
        <div className="hidden lg:block">
          {viewMode === 'table' ? (
            <LeadTable
              leads={filteredLeads}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteLead}
            />
          ) : (
            <div className="grid grid-cols-3 gap-6">
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
      </div>

      {/* Modal Popup Container containing LeadForm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
            role="presentation"
          />

          {/* Modal Content Dialog */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 z-10 overflow-y-auto max-h-[90vh] transition-all transform scale-100 duration-300 border border-slate-100"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button X Icon */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
