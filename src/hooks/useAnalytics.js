import { useState, useMemo } from 'react';
import { useLeads } from './useLeads';
import {
  parseLeadValue,
  normalizeStatus,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getFunnelData,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getActivityHeatmapData,
  getLeadSourceStats
} from '../utils/analyticsHelpers';

export const useAnalytics = () => {
  const { leads } = useLeads();
  const [filterType, setFilterType] = useState('30d'); // '7d' | '30d' | '90d' | 'thisYear' | 'custom'
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // Get current anchor date (latest date in leads database, fallback to now)
  const anchorDate = useMemo(() => {
    if (!leads || leads.length === 0) return new Date();
    const dates = leads
      .map(l => new Date(l.createdAt || l.date || Date.now()))
      .filter(d => !isNaN(d.getTime()));
    return dates.length > 0 ? new Date(Math.max(...dates)) : new Date();
  }, [leads]);

  // Compute date boundaries
  const boundaries = useMemo(() => {
    let end = new Date(anchorDate);
    let start = new Date(anchorDate);
    let priorStart = new Date(anchorDate);
    let priorEnd = new Date(anchorDate);

    switch (filterType) {
      case '7d':
        start.setDate(end.getDate() - 7);
        priorEnd.setDate(start.getDate());
        priorStart.setDate(priorEnd.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        priorEnd.setDate(start.getDate());
        priorStart.setDate(priorEnd.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        priorEnd.setDate(start.getDate());
        priorStart.setDate(priorEnd.getDate() - 90);
        break;
      case 'thisYear':
        start = new Date(end.getFullYear(), 0, 1);
        priorEnd = new Date(start.getTime() - 1);
        priorStart = new Date(priorEnd.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customRange.start) start = new Date(customRange.start);
        if (customRange.end) {
          end = new Date(customRange.end);
          end.setHours(23, 59, 59, 999);
        }
        // Calculate diff for prior period
        const diffMs = end.getTime() - start.getTime();
        priorEnd = new Date(start.getTime() - 1);
        priorStart = new Date(priorEnd.getTime() - diffMs);
        break;
      default:
        start.setDate(end.getDate() - 30);
        priorEnd.setDate(start.getDate());
        priorStart.setDate(priorEnd.getDate() - 30);
    }

    return { start, end, priorStart, priorEnd };
  }, [filterType, customRange, anchorDate]);

  // Filter leads for current period and prior period
  const filteredData = useMemo(() => {
    if (!leads) return { current: [], prior: [] };

    const current = [];
    const prior = [];

    leads.forEach((l) => {
      const createdDate = new Date(l.createdAt || l.date);
      if (!isNaN(createdDate.getTime())) {
        if (createdDate >= boundaries.start && createdDate <= boundaries.end) {
          current.push(l);
        } else if (createdDate >= boundaries.priorStart && createdDate <= boundaries.priorEnd) {
          prior.push(l);
        }
      }
    });

    return { current, prior };
  }, [leads, boundaries]);

  // Memoized calculations for current period
  const metrics = useMemo(() => {
    const { current, prior } = filteredData;

    // Current period metrics
    const totalLeads = current.length;
    const conversionRate = totalLeads
      ? Math.round((current.filter(l => normalizeStatus(l.status) === 'Won').length / totalLeads) * 100)
      : 0;
    const pipelineValue = getPipelineValue(current);
    const wonRevenue = getWonRevenue(current);
    const avgSalesCycle = getAverageSalesCycle(current);
    const lostRate = getLostRate(current);
    const salesVelocity = getSalesVelocity(current);

    // Prior period metrics (for trend arrows)
    const priorTotalLeads = prior.length;
    const priorConversionRate = priorTotalLeads
      ? Math.round((prior.filter(l => normalizeStatus(l.status) === 'Won').length / priorTotalLeads) * 100)
      : 0;
    const priorPipelineValue = getPipelineValue(prior);
    const priorWonRevenue = getWonRevenue(prior);
    const priorAvgSalesCycle = getAverageSalesCycle(prior);
    const priorLostRate = getLostRate(prior);
    const priorSalesVelocity = getSalesVelocity(prior);

    // Calculate growth percentages
    const calcGrowth = (curr, prev) => {
      if (!prev) return curr ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    return {
      current: {
        totalLeads,
        conversionRate,
        pipelineValue,
        wonRevenue,
        avgSalesCycle,
        lostRate,
        salesVelocity
      },
      growth: {
        totalLeads: calcGrowth(totalLeads, priorTotalLeads),
        conversionRate: conversionRate - priorConversionRate, // percentage points change
        pipelineValue: calcGrowth(pipelineValue, priorPipelineValue),
        wonRevenue: calcGrowth(wonRevenue, priorWonRevenue),
        avgSalesCycle: avgSalesCycle - priorAvgSalesCycle, // days difference
        lostRate: lostRate - priorLostRate, // percentage points difference
        salesVelocity: calcGrowth(salesVelocity, priorSalesVelocity)
      }
    };
  }, [filteredData]);

  // Visual/Chart selectors always calculated on current filtered subset
  const chartData = useMemo(() => {
    const { current } = filteredData;
    return {
      statusDistribution: getStatusDistribution(current),
      monthlyLeads: getMonthlyLeads(leads),
      conversionByMonth: getConversionByMonth(leads),
      revenueByMonth: getRevenueByMonth(leads),
      leadSourceStats: getLeadSourceStats(current),
      funnelData: getFunnelData(current),
      forecastRevenue: getForecastRevenue(leads),
      topPerformers: getTopPerformers(leads),
      activityHeatmap: getActivityHeatmapData(leads)
    };
  }, [filteredData, leads]);

  return {
    filterType,
    setFilterType,
    customRange,
    setCustomRange,
    leadsCount: filteredData.current.length,
    rawLeads: filteredData.current, // Expose raw active list
    metrics,
    chartData,
    dateBoundaries: boundaries
  };
};

export default useAnalytics;
