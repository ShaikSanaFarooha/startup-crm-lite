import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Users, Target, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

/**
 * Dashboard Page Component
 * Assembles and presents StatsCards, PipelineOverview, RecentLeads,
 * and QuickActions in a responsive grid layout. Contains sample leads data.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Mock leads data (aligned with Leads page schema)
  const sampleLeads = [
    { id: 1, name: 'Emma Watson', company: 'Hogwarts Inc', email: 'emma@hogwarts.edu', phone: '+1 555-0199', value: '$15,000', status: 'Qualified', date: '2026-06-12' },
    { id: 2, name: 'John Doe', company: 'Global Tech', email: 'john@globaltech.com', phone: '+1 555-0123', value: '$8,200', status: 'In Progress', date: '2026-06-14' },
    { id: 3, name: 'Alice Smith', company: 'Apex Labs', email: 'alice@apexlabs.org', phone: '+1 555-0145', value: '$22,500', status: 'New', date: '2026-06-15' },
    { id: 4, name: 'Bruce Wayne', company: 'Wayne Enterprises', email: 'bruce@wayne.com', phone: '+1 555-1939', value: '$120,000', status: 'Qualified', date: '2026-06-01' },
    { id: 5, name: 'Clara Oswald', company: 'Time Travelers Ltd', email: 'clara@tardis.co', phone: '+1 555-1100', value: '$4,800', status: 'Contacted', date: '2026-06-10' },
    { id: 6, name: 'Tony Stark', company: 'Stark Industries', email: 'tony@stark.com', phone: '+1 555-3000', value: '$95,000', status: 'In Progress', date: '2026-06-08' },
    { id: 7, name: 'Peter Parker', company: 'Daily Bugle', email: 'peter@bugle.com', phone: '+1 555-9000', value: '$1,500', status: 'New', date: '2026-06-16' },
  ];

  // Stats definition utilizing the StatsCard schema
  const stats = [
    {
      title: 'Total Leads',
      value: '1,248',
      change: '12.5',
      icon: Users,
      color: 'primary',
    },
    {
      title: 'Conversion Rate',
      value: '24.3%',
      change: '2.1',
      icon: Target,
      color: 'success',
    },
    {
      title: 'Active Pipeline',
      value: '$266,500',
      change: '18.4',
      icon: DollarSign,
      color: 'warning',
    },
    {
      title: 'Closed Deals',
      value: '94',
      change: '-1.5',
      icon: Award,
      color: 'danger',
    },
  ];

  /**
   * Action handler: Open modal/drawer to add new lead
   */
  const handleAddNewLead = () => {
    toast.success('Add New Lead drawer opened!');
  };

  /**
   * Action handler: Navigate to Leads directory page
   */
  const handleViewAllLeads = () => {
    navigate('/leads');
  };

  /**
   * Action handler: Generate and trigger client-side CSV download of mock leads
   */
  const handleExportData = () => {
    try {
      const headers = 'Name,Company,Email,Phone,Value,Status,Date Added\n';
      const rows = sampleLeads
        .map((lead) => `"${lead.name}","${lead.company}","${lead.email}","${lead.phone}","${lead.value}","${lead.status}","${lead.date}"`)
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

      {/* KPI Cards Grid - Responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
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

      {/* Main Grid Content - Responsive: Stacked on mobile/tablet, Side-by-Side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PipelineOverview leads={sampleLeads} />
          <RecentLeads leads={sampleLeads} />
        </div>
        <div className="space-y-6">
          <QuickActions
            onAddNewLead={handleAddNewLead}
            onViewAllLeads={handleViewAllLeads}
            onExportData={handleExportData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
