import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Users, Target, DollarSign, Award, X } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import LeadForm from '../components/leads/LeadForm';
import { useLeads } from '../hooks/useLeads';
import { parseLeadValue } from '../utils/analyticsHelpers';

/**
 * Dashboard Page Component
 * Assembles and presents StatsCards, PipelineOverview, RecentLeads,
 * and QuickActions in a responsive grid layout. Consumes state from useLeads context.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { leads, addLead } = useLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Helper to parse lead creation date or fallback date
  const getLeadDate = (l) => new Date(l.createdAt || l.date || Date.now());

  // Dynamic statistics calculations
  const totalLeadsCount = leads.length;
  const wonLeads = leads.filter(l => l.status === 'Won');
  const activeLeads = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost');
  
  const pipelineValue = activeLeads.reduce((sum, l) => sum + parseLeadValue(l.value), 0);
  const closedDealsCount = wonLeads.length;
  
  const conversionRate = totalLeadsCount ? Math.round((closedDealsCount / totalLeadsCount) * 100) : 0;

  // Comparison logic for trend metrics (Last 30 Days vs Prior 30 Days)
  const anchorDate = leads.length > 0 
    ? new Date(Math.max(...leads.map(l => getLeadDate(l).getTime())))
    : new Date();

  const thirtyDaysAgo = new Date(anchorDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(anchorDate.getTime() - 60 * 24 * 60 * 60 * 1000);

  const currentPeriodLeads = leads.filter(l => getLeadDate(l) >= thirtyDaysAgo);
  const priorPeriodLeads = leads.filter(l => {
    const d = getLeadDate(l);
    return d >= sixtyDaysAgo && d < thirtyDaysAgo;
  });

  const currentWonCount = currentPeriodLeads.filter(l => l.status === 'Won').length;
  const priorWonCount = priorPeriodLeads.filter(l => l.status === 'Won').length;

  const currentConv = currentPeriodLeads.length ? (currentWonCount / currentPeriodLeads.length) * 100 : 0;
  const priorConv = priorPeriodLeads.length ? (priorWonCount / priorPeriodLeads.length) * 100 : 0;

  const currentActivePipeline = currentPeriodLeads
    .filter(l => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, l) => sum + parseLeadValue(l.value), 0);
  const priorActivePipeline = priorPeriodLeads
    .filter(l => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, l) => sum + parseLeadValue(l.value), 0);

  const leadsGrowth = priorPeriodLeads.length 
    ? (((currentPeriodLeads.length - priorPeriodLeads.length) / priorPeriodLeads.length) * 100).toFixed(1)
    : (currentPeriodLeads.length ? '100.0' : '0.0');

  const conversionGrowth = (currentConv - priorConv).toFixed(1);

  const pipelineGrowth = priorActivePipeline
    ? (((currentActivePipeline - priorActivePipeline) / priorActivePipeline) * 100).toFixed(1)
    : (currentActivePipeline ? '100.0' : '0.0');

  const wonGrowth = priorWonCount
    ? (((currentWonCount - priorWonCount) / priorWonCount) * 100).toFixed(1)
    : (currentWonCount ? '100.0' : '0.0');

  // Stats definition utilizing the StatsCard schema
  const stats = [
    {
      title: 'Total Leads',
      value: totalLeadsCount.toLocaleString(),
      change: (parseFloat(leadsGrowth) >= 0 ? '+' : '') + leadsGrowth,
      icon: Users,
      color: 'primary',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: (parseFloat(conversionGrowth) >= 0 ? '+' : '') + conversionGrowth,
      icon: Target,
      color: 'success',
    },
    {
      title: 'Active Pipeline',
      value: formatCurrency(pipelineValue),
      change: (parseFloat(pipelineGrowth) >= 0 ? '+' : '') + pipelineGrowth,
      icon: DollarSign,
      color: 'warning',
    },
    {
      title: 'Closed Deals',
      value: closedDealsCount.toLocaleString(),
      change: (parseFloat(wonGrowth) >= 0 ? '+' : '') + wonGrowth,
      icon: Award,
      color: 'danger',
    },
  ];

  /**
   * Action handler: Open modal/drawer to add new lead
   */
  const handleAddNewLead = () => {
    setIsModalOpen(true);
  };

  /**
   * Action handler: Navigate to Leads directory page
   */
  const handleViewAllLeads = () => {
    navigate('/leads');
  };

  /**
   * Action handler: Generate and trigger client-side CSV download of leads
   */
  const handleExportData = () => {
    try {
      const headers = 'Name,Company,Email,Phone,Value,Status,Date Added\n';
      const rows = leads
        .map((lead) => `"${lead.name}","${lead.company}","${lead.email}","${lead.phone}","${lead.value}","${lead.status}","${lead.createdAt || lead.date}"`)
        .join('\n');
      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
      
      const link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', `crm_leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Leads export file downloaded!');
    } catch (err) {
      toast.error('Failed to export leads data.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-950/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-indigo-500 to-transparent blur-2xl" />
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            <Award size={14} /> Startup CRM Lite Active
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, Sana!</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Your CRM has captured new active leads today. Monitor pipeline metrics, coordinate sales tasks, and review performance targets.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PipelineOverview leads={leads} />
          <RecentLeads leads={leads} />
        </div>
        <div className="space-y-6">
          <QuickActions
            onAddNewLead={handleAddNewLead}
            onViewAllLeads={handleViewAllLeads}
            onExportData={handleExportData}
          />
        </div>
      </div>

      {/* Modal Popup Container containing LeadForm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
            onClick={() => setIsModalOpen(false)}
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
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Embedded Form */}
            <LeadForm
              onSubmit={(formData) => {
                addLead(formData);
                setIsModalOpen(false);
                toast.success('New lead captured successfully!');
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
