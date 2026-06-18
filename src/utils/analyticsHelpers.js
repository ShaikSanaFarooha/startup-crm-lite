// Utility function to normalize status
export const normalizeStatus = (status) => {
  if (!status) return 'New';
  const s = status.trim();
  if (s === 'Meeting Scheduled' || s === 'Meeting') return 'Meeting';
  if (s === 'Proposal Sent' || s === 'Proposal') return 'Proposal';
  return s;
};

// Defensive parser for lead value
export const parseLeadValue = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // Extract number from currency string (supporting $ and ₹)
  const numeric = parseFloat(val.replace(/[^0-9.-]+/g, ''));
  return isNaN(numeric) ? 0 : numeric;
};

// 1. Get Status Distribution
export const getStatusDistribution = (leads) => {
  if (!leads || leads.length === 0) return [];
  
  const counts = { New: 0, Contacted: 0, Meeting: 0, Proposal: 0, Won: 0, Lost: 0 };
  
  leads.forEach((l) => {
    const s = normalizeStatus(l.status);
    if (counts[s] !== undefined) {
      counts[s]++;
    }
  });

  const total = leads.length;
  
  // Return in pipeline stage order
  const order = ['Won', 'Proposal', 'Meeting', 'Contacted', 'New', 'Lost'];
  return order.map((status) => {
    const count = counts[status];
    const percentage = total ? Math.round((count / total) * 100) : 0;
    return {
      name: status,
      value: count,
      percentage: percentage
    };
  });
};

// Helper to get last 6 calendar months
const getLast6MonthsConfig = (leads) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // To keep it robust, find the latest date in leads, fallback to current time
  let latestDate = new Date();
  if (leads && leads.length > 0) {
    const dates = leads.map(l => new Date(l.createdAt || l.date || Date.now())).filter(d => !isNaN(d.getTime()));
    if (dates.length > 0) {
      latestDate = new Date(Math.max(...dates));
    }
  }

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(latestDate.getFullYear(), latestDate.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      name: monthNames[d.getMonth()],
      year: d.getFullYear(),
      monthNum: d.getMonth()
    });
  }
  return months;
};

// 2. Get Monthly Leads
export const getMonthlyLeads = (leads) => {
  const months = getLast6MonthsConfig(leads);
  if (!leads || leads.length === 0) {
    return months.map(m => ({ name: m.name, count: 0 }));
  }

  const counts = {};
  months.forEach(m => { counts[m.key] = 0; });

  leads.forEach(l => {
    const dateStr = l.createdAt || l.date;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (counts[key] !== undefined) {
          counts[key]++;
        }
      }
    }
  });

  return months.map(m => ({
    name: m.name,
    count: counts[m.key],
    year: m.year
  }));
};

// 3. Get Conversion Rate by Month
export const getConversionByMonth = (leads) => {
  const months = getLast6MonthsConfig(leads);
  if (!leads || leads.length === 0) {
    return months.map(m => ({ name: m.name, rate: 0 }));
  }

  const totals = {};
  const wons = {};
  months.forEach(m => {
    totals[m.key] = 0;
    wons[m.key] = 0;
  });

  leads.forEach(l => {
    const dateStr = l.createdAt || l.date;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (totals[key] !== undefined) {
          totals[key]++;
          if (normalizeStatus(l.status) === 'Won') {
            wons[key]++;
          }
        }
      }
    }
  });

  return months.map(m => {
    const total = totals[m.key];
    const won = wons[m.key];
    const rate = total ? Math.round((won / total) * 100) : 0;
    return {
      name: m.name,
      rate: rate,
      year: m.year
    };
  });
};

// 4. Get Revenue by Month
export const getRevenueByMonth = (leads) => {
  const months = getLast6MonthsConfig(leads);
  if (!leads || leads.length === 0) {
    return months.map(m => ({ name: m.name, revenue: 0 }));
  }

  const revenue = {};
  months.forEach(m => { revenue[m.key] = 0; });

  leads.forEach(l => {
    if (normalizeStatus(l.status) === 'Won') {
      // Group by wonAt date if present, fallback to createdAt or date
      const dateStr = l.wonAt || l.createdAt || l.date;
      if (dateStr) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (revenue[key] !== undefined) {
            revenue[key] += parseLeadValue(l.value);
          }
        }
      }
    }
  });

  return months.map(m => ({
    name: m.name,
    revenue: revenue[m.key],
    year: m.year
  }));
};

// 5. Get Pipeline Value (Active Leads sum)
export const getPipelineValue = (leads) => {
  if (!leads) return 0;
  return leads
    .filter(l => {
      const status = normalizeStatus(l.status);
      return status !== 'Won' && status !== 'Lost';
    })
    .reduce((sum, l) => sum + parseLeadValue(l.value), 0);
};

// 6. Get Won Revenue
export const getWonRevenue = (leads) => {
  if (!leads) return 0;
  return leads
    .filter(l => normalizeStatus(l.status) === 'Won')
    .reduce((sum, l) => sum + parseLeadValue(l.value), 0);
};

// 7. Get Average Sales Cycle
export const getAverageSalesCycle = (leads) => {
  if (!leads) return 0;
  const wonLeads = leads.filter(l => normalizeStatus(l.status) === 'Won');
  if (wonLeads.length === 0) return 0;

  let totalDays = 0;
  let count = 0;

  wonLeads.forEach(l => {
    const startStr = l.createdAt || l.date;
    const endStr = l.wonAt;
    if (startStr && endStr) {
      const start = new Date(startStr);
      const end = new Date(endStr);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = end.getTime() - start.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays >= 0) {
          totalDays += diffDays;
          count++;
        }
      }
    }
  });

  return count ? Math.round(totalDays / count) : 0;
};

// 8. Get Lost Rate
export const getLostRate = (leads) => {
  if (!leads || leads.length === 0) return 0;
  const lostCount = leads.filter(l => normalizeStatus(l.status) === 'Lost').length;
  return Math.round((lostCount / leads.length) * 100);
};

// 9. Get Lead Source Stats
export const getLeadSourceStats = (leads) => {
  if (!leads || leads.length === 0) return [];

  const counts = {};
  leads.forEach(l => {
    const source = l.source || 'Other';
    counts[source] = (counts[source] || 0) + 1;
  });

  return Object.keys(counts)
    .map(key => ({
      name: key,
      value: counts[key]
    }))
    .sort((a, b) => b.value - a.value);
};

// 10. Get Funnel Data
export const getFunnelData = (leads) => {
  if (!leads || leads.length === 0) return [];
  
  const newCount = leads.length;
  const contactedCount = leads.filter(l => l.contactedAt || !['New'].includes(normalizeStatus(l.status))).length;
  const meetingCount = leads.filter(l => l.meetingAt || ['Meeting', 'Proposal', 'Won'].includes(normalizeStatus(l.status))).length;
  const proposalCount = leads.filter(l => l.proposalAt || ['Proposal', 'Won'].includes(normalizeStatus(l.status))).length;
  const wonCount = leads.filter(l => l.wonAt || normalizeStatus(l.status) === 'Won').length;

  return [
    { stage: 'New', count: newCount, conversion: 100, dropoff: 0 },
    { 
      stage: 'Contacted', 
      count: contactedCount, 
      conversion: newCount ? Math.round((contactedCount / newCount) * 100) : 0,
      dropoff: newCount ? Math.round(((newCount - contactedCount) / newCount) * 100) : 0 
    },
    { 
      stage: 'Meeting', 
      count: meetingCount, 
      conversion: newCount ? Math.round((meetingCount / newCount) * 100) : 0,
      dropoff: contactedCount ? Math.round(((contactedCount - meetingCount) / contactedCount) * 100) : 0
    },
    { 
      stage: 'Proposal', 
      count: proposalCount, 
      conversion: newCount ? Math.round((proposalCount / newCount) * 100) : 0,
      dropoff: meetingCount ? Math.round(((meetingCount - proposalCount) / meetingCount) * 100) : 0
    },
    { 
      stage: 'Won', 
      count: wonCount, 
      conversion: newCount ? Math.round((wonCount / newCount) * 100) : 0,
      dropoff: proposalCount ? Math.round(((proposalCount - wonCount) / proposalCount) * 100) : 0
    }
  ];
};

// 11. Get Sales Velocity
export const getSalesVelocity = (leads) => {
  if (!leads || leads.length === 0) return 0;
  
  const opportunities = leads.length;
  const wonLeads = leads.filter(l => normalizeStatus(l.status) === 'Won');
  const winRate = opportunities ? wonLeads.length / opportunities : 0;
  
  const totalWonValue = wonLeads.reduce((sum, l) => sum + parseLeadValue(l.value), 0);
  const avgDealSize = wonLeads.length ? totalWonValue / wonLeads.length : 0;
  
  const salesCycleDays = getAverageSalesCycle(leads) || 1; // Prevent division by zero, standard fallback is 1 day

  // Velocity Formula: (Opportunities * Win Rate * Avg Deal Size) / Sales Cycle Length
  const velocity = (opportunities * winRate * avgDealSize) / salesCycleDays;
  
  return Math.round(velocity);
};

// 12. Get Revenue Forecast
export const getForecastRevenue = (leads) => {
  const monthlyRevenue = getRevenueByMonth(leads); // Yields revenue in last 6 calendar months
  if (monthlyRevenue.length === 0) return 0;
  
  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = totalRevenue / monthlyRevenue.length;
  
  return Math.round(avgRevenue);
};

// 13. Get Top Performers
export const getTopPerformers = (leads) => {
  if (!leads || leads.length === 0) return [];
  
  const repRevenue = {};
  
  leads.forEach(l => {
    if (normalizeStatus(l.status) === 'Won') {
      const owner = l.owner || 'Unassigned';
      repRevenue[owner] = (repRevenue[owner] || 0) + parseLeadValue(l.value);
    }
  });

  return Object.keys(repRevenue)
    .map(key => ({
      name: key,
      revenue: repRevenue[key]
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

// 14. Get Activity Heatmap Data
export const getActivityHeatmapData = (leads) => {
  if (!leads) return [];
  
  // Find latest lead date or default to current date
  let baseDate = new Date();
  if (leads.length > 0) {
    const dates = leads.map(l => new Date(l.createdAt || l.date || Date.now())).filter(d => !isNaN(d.getTime()));
    if (dates.length > 0) {
      baseDate = new Date(Math.max(...dates));
    }
  }

  // Generate date array for the last 30 calendar days
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    data.push({
      date: dateStr,
      displayDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      created: 0,
      meetings: 0,
      calls: 0,
      count: 0
    });
  }

  const map = {};
  data.forEach(item => { map[item.date] = item; });

  leads.forEach(l => {
    // 1. Created lead
    const createdStr = (l.createdAt || l.date || '').slice(0, 10);
    if (map[createdStr]) {
      map[createdStr].created++;
      map[createdStr].count++;
    }
    
    // 2. Meeting Scheduled (uses meetingAt)
    if (l.meetingAt) {
      const meetingStr = l.meetingAt.slice(0, 10);
      if (map[meetingStr]) {
        map[meetingStr].meetings++;
        map[meetingStr].count++;
      }
    }
    
    // 3. Contacted/Call logged (uses contactedAt)
    if (l.contactedAt) {
      const contactedStr = l.contactedAt.slice(0, 10);
      if (map[contactedStr]) {
        map[contactedStr].calls++;
        map[contactedStr].count++;
      }
    }
  });

  return data;
};
