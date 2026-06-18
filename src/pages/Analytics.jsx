import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

/**
 * Analytics Page Component
 * Connects the useAnalytics hook to filtered lead metrics, rendering
 * a fully responsive, premium SaaS business intelligence panel.
 *
 * @returns {React.JSX.Element} The rendered Analytics Dashboard page.
 */
const Analytics = () => {
  const {
    filterType,
    setFilterType,
    customRange,
    setCustomRange,
    leadsCount,
    rawLeads,
    metrics,
    chartData
  } = useAnalytics();

  const [isLoading, setIsLoading] = useState(true);

  // Soft simulated loading time on initial load for visual premium feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  if (leadsCount === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <AnalyticsFilters
          filterType={filterType}
          setFilterType={setFilterType}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />
        <EmptyAnalyticsState />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <AnalyticsFilters
        filterType={filterType}
        setFilterType={setFilterType}
        customRange={customRange}
        setCustomRange={setCustomRange}
      />

      {/* KPI Stats Cards */}
      <StatsCards metrics={metrics} />

      {/* Responsive Layout Grid
          Mobile: 1 column
          Tablet: 2 columns
          Desktop: 2 columns (Pie + Funnel, Bar + Line, Area + Sources, Heatmap + Performers, Forecast + Velocity)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1: Pie Chart & Funnel Chart */}
        <PieChartCard data={chartData.statusDistribution} />
        <FunnelChartCard data={chartData.funnelData} />

        {/* Row 2: Bar Chart & Line Chart */}
        <BarChartCard data={chartData.monthlyLeads} />
        <LineChartCard data={chartData.conversionByMonth} />

        {/* Row 3: Revenue Chart & Lead Source Chart */}
        <RevenueChartCard data={chartData.revenueByMonth} />
        <LeadSourceChart data={chartData.leadSourceStats} />

        {/* Row 4: Activity Heatmap & Top Performers */}
        <ActivityHeatmap data={chartData.activityHeatmap} />
        <TopPerformersCard data={chartData.topPerformers} />

        {/* Row 5: Revenue Forecast & Sales Velocity */}
        <ForecastCard
          forecastedRevenue={chartData.forecastRevenue}
          activeLeads={rawLeads.filter(l => {
            const s = l.status.trim();
            return s !== 'Won' && s !== 'Lost';
          })}
          monthlyRevenues={chartData.revenueByMonth}
        />
        <SalesVelocityCard
          velocity={metrics.current.salesVelocity}
          growth={metrics.growth.salesVelocity}
        />
      </div>
    </div>
  );
};

export default Analytics;
