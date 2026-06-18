import React, { createContext, useState, useEffect } from 'react';

export const LeadContext = createContext(null);

const SEED_OWNERS = ['Sarah', 'Alex', 'David'];
const SEED_SOURCES = ['LinkedIn', 'Referral', 'Website', 'Instagram', 'Ads', 'Cold Email'];
const SEED_STATUSES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

// Deterministic seed helper
const generateMockLeads = () => {
  const leads = [];
  const firstNames = ['John', 'Emma', 'Bruce', 'Clara', 'Tony', 'Peter', 'Sarah', 'Alex', 'David', 'Sophia', 'Michael', 'Emily', 'Daniel', 'Olivia', 'James', 'Ava', 'Robert', 'Isabella', 'William', 'Mia', 'Joseph', 'Charlotte', 'Thomas', 'Amelia'];
  const lastNames = ['Doe', 'Watson', 'Wayne', 'Oswald', 'Stark', 'Parker', 'Miller', 'Johnson', 'Smith', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis'];
  const companies = ['Acme Corp', 'Wayne Ent', 'Stark Industries', 'Hogwarts Inc', 'Apex Labs', 'Global Tech', 'Time Travelers Ltd', 'Daily Bugle', 'Cyberdyne', 'Tyrell Corp', 'Initech', 'Soylent Corp', 'Hooli', 'Pied Piper', 'Vehement Capital', 'Oscorp', 'Umbrella Corp', 'Massive Dynamic', 'Virtucon', 'Dunder Mifflin'];

  // Keep a deterministic counter
  let idCounter = 1;

  // Let's create helper to generate a date in a specific month of 2026
  // Months: 0 = Jan, 1 = Feb, 2 = Mar, 3 = Apr, 4 = May, 5 = Jun
  const getDateInMonth = (month, daySeed) => {
    const day = (daySeed % 28) + 1;
    const pad = (n) => String(n).padStart(2, '0');
    return `2026-${pad(month + 1)}-${pad(day)}T10:00:00Z`;
  };

  // 1. Generate Won leads (Exactly 34 leads)
  // Sarah: 12 leads, total won value = ₹4,20,000
  // Alex: 11 leads, total won value = ₹3,60,000
  // David: 11 leads, total won value = ₹2,95,000
  // Total won value = ₹10,75,000
  const sarahWonValues = [50000, 40000, 35000, 30000, 45000, 35000, 50000, 40000, 35000, 30000, 20000, 15000];
  const alexWonValues = [30000, 40000, 30000, 40000, 35000, 45000, 35000, 45000, 30000, 20000, 10000];
  const davidWonValues = [30000, 30000, 30000, 30000, 35000, 30000, 35000, 25000, 20000, 15000, 15000];

  const addWonLead = (owner, value, month, index) => {
    const createdAt = getDateInMonth(month, index * 7);
    const createdDate = new Date(createdAt);
    // Add sales cycle between 5 and 31 days (average 18 days)
    const salesCycleDays = 5 + ((index * 9) % 27); 
    const wonDate = new Date(createdDate.getTime() + salesCycleDays * 24 * 60 * 60 * 1000);
    const wonAt = wonDate.toISOString();

    const leadName = `${firstNames[(index * 3) % firstNames.length]} ${lastNames[(index * 2) % lastNames.length]}`;
    const company = companies[(index * 4) % companies.length];
    
    // Distribute sources:
    // Sources list: ['LinkedIn', 'Referral', 'Website', 'Instagram', 'Ads', 'Cold Email']
    // We want LinkedIn (48), Referral (31), Website (22) to dominate
    const sourceIndex = (index * 13) % 100;
    let source = 'LinkedIn';
    if (sourceIndex < 38) source = 'LinkedIn';
    else if (sourceIndex < 63) source = 'Referral';
    else if (sourceIndex < 81) source = 'Website';
    else if (sourceIndex < 89) source = 'Instagram';
    else if (sourceIndex < 95) source = 'Ads';
    else source = 'Cold Email';

    leads.push({
      id: `lead_${String(idCounter++).padStart(3, '0')}`,
      name: leadName,
      company: company,
      email: `${leadName.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: `+91 99999${String(10000 + idCounter).slice(1)}`,
      status: 'Won',
      source,
      value: value,
      createdAt,
      date: createdAt.slice(0, 10),
      contactedAt: new Date(createdDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      meetingAt: new Date(createdDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      proposalAt: new Date(createdDate.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      wonAt,
      owner
    });
  };

  // Add Won leads spread across 6 months
  // January: 4 Won leads (Jan is index 0)
  // February: 5 Won leads (Feb is index 1)
  // March: 6 Won leads (Mar is 2)
  // April: 6 Won leads (Apr is 3)
  // May: 6 Won leads (May is 4)
  // June: 7 Won leads (Jun is 5)
  // We'll distribute the values arrays: Sarah (12), Alex (11), David (11) = 34 leads total.
  const allWonConfigs = [
    // Jan (4)
    { owner: 'Sarah', value: sarahWonValues[0], month: 0 },
    { owner: 'Sarah', value: sarahWonValues[1], month: 0 },
    { owner: 'Alex', value: alexWonValues[0], month: 0 },
    { owner: 'David', value: davidWonValues[0], month: 0 },
    // Feb (5)
    { owner: 'Sarah', value: sarahWonValues[2], month: 1 },
    { owner: 'Sarah', value: sarahWonValues[3], month: 1 },
    { owner: 'Alex', value: alexWonValues[1], month: 1 },
    { owner: 'Alex', value: alexWonValues[2], month: 1 },
    { owner: 'David', value: davidWonValues[1], month: 1 },
    // Mar (6)
    { owner: 'Sarah', value: sarahWonValues[4], month: 2 },
    { owner: 'Sarah', value: sarahWonValues[5], month: 2 },
    { owner: 'Alex', value: alexWonValues[3], month: 2 },
    { owner: 'Alex', value: alexWonValues[4], month: 2 },
    { owner: 'David', value: davidWonValues[2], month: 2 },
    { owner: 'David', value: davidWonValues[3], month: 2 },
    // Apr (6)
    { owner: 'Sarah', value: sarahWonValues[6], month: 3 },
    { owner: 'Sarah', value: sarahWonValues[7], month: 3 },
    { owner: 'Alex', value: alexWonValues[5], month: 3 },
    { owner: 'Alex', value: alexWonValues[6], month: 3 },
    { owner: 'David', value: davidWonValues[4], month: 3 },
    { owner: 'David', value: davidWonValues[5], month: 3 },
    // May (6)
    { owner: 'Sarah', value: sarahWonValues[8], month: 4 },
    { owner: 'Sarah', value: sarahWonValues[9], month: 4 },
    { owner: 'Alex', value: alexWonValues[7], month: 4 },
    { owner: 'Alex', value: alexWonValues[8], month: 4 },
    { owner: 'David', value: davidWonValues[6], month: 4 },
    { owner: 'David', value: davidWonValues[7], month: 4 },
    // Jun (7)
    { owner: 'Sarah', value: sarahWonValues[10], month: 5 },
    { owner: 'Sarah', value: sarahWonValues[11], month: 5 },
    { owner: 'Alex', value: alexWonValues[9], month: 5 },
    { owner: 'Alex', value: alexWonValues[10], month: 5 },
    { owner: 'David', value: davidWonValues[8], month: 5 },
    { owner: 'David', value: davidWonValues[9], month: 5 },
    { owner: 'David', value: davidWonValues[10], month: 5 }
  ];

  allWonConfigs.forEach((cfg, idx) => {
    addWonLead(cfg.owner, cfg.value, cfg.month, idx);
  });

  // 2. Generate Active leads (Exactly 63 leads: 10 New, 14 Contacted, 18 Meeting Scheduled, 21 Proposal Sent)
  // Total Active value = ₹12,40,000
  // Let's create arrays of active lead configurations.
  // We want to distribute them across Jan-Jun.
  // Values:
  // 10 New leads: 10,000 each (Total: 100,000)
  // 14 Contacted: 18,000 each (Total: 252,000)
  // 18 Meeting Scheduled: 20,000 each (Total: 360,000)
  // 21 Proposal Sent: 25,142 average, let's say 20 leads of 25,000 and 1 lead of 28,000 (Total: 528,000)
  // Sum of active: 100k + 252k + 360k + 528k = ₹12,40,000! Exactly ₹12,40,000.
  
  const activeConfigs = [];
  // 10 New leads
  for (let i = 0; i < 10; i++) {
    activeConfigs.push({ status: 'New', value: 10000, month: i % 6 });
  }
  // 14 Contacted leads
  for (let i = 0; i < 14; i++) {
    activeConfigs.push({ status: 'Contacted', value: 18000, month: (i + 1) % 6 });
  }
  // 18 Meeting Scheduled leads
  for (let i = 0; i < 18; i++) {
    activeConfigs.push({ status: 'Meeting Scheduled', value: 20000, month: (i + 2) % 6 });
  }
  // 21 Proposal Sent leads
  for (let i = 0; i < 21; i++) {
    const val = i === 20 ? 28000 : 25000;
    activeConfigs.push({ status: 'Proposal Sent', value: val, month: (i + 3) % 6 });
  }

  activeConfigs.forEach((cfg, idx) => {
    const month = cfg.month;
    const createdAt = getDateInMonth(month, idx * 3 + 1);
    const createdDate = new Date(createdAt);
    const owner = SEED_OWNERS[idx % SEED_OWNERS.length];
    
    const leadName = `${firstNames[(idx * 4 + 2) % firstNames.length]} ${lastNames[(idx * 3 + 1) % lastNames.length]}`;
    const company = companies[(idx * 5 + 3) % companies.length];

    const sourceIndex = (idx * 17) % 100;
    let source = 'LinkedIn';
    if (sourceIndex < 38) source = 'LinkedIn';
    else if (sourceIndex < 63) source = 'Referral';
    else if (sourceIndex < 81) source = 'Website';
    else if (sourceIndex < 89) source = 'Instagram';
    else if (sourceIndex < 95) source = 'Ads';
    else source = 'Cold Email';

    const lead = {
      id: `lead_${String(idCounter++).padStart(3, '0')}`,
      name: leadName,
      company: company,
      email: `${leadName.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: `+91 99999${String(10000 + idCounter).slice(1)}`,
      status: cfg.status,
      source,
      value: cfg.value,
      createdAt,
      date: createdAt.slice(0, 10),
      owner
    };

    // Populate partial dates
    if (cfg.status !== 'New') {
      lead.contactedAt = new Date(createdDate.getTime() + 1.5 * 24 * 60 * 60 * 1000).toISOString();
    }
    if (cfg.status === 'Meeting Scheduled' || cfg.status === 'Proposal Sent') {
      lead.meetingAt = new Date(createdDate.getTime() + 3.5 * 24 * 60 * 60 * 1000).toISOString();
    }
    if (cfg.status === 'Proposal Sent') {
      lead.proposalAt = new Date(createdDate.getTime() + 6.5 * 24 * 60 * 60 * 1000).toISOString();
    }

    leads.push(lead);
  });

  // 3. Generate Lost leads (Exactly 27 leads)
  // Let's spread across Jan-Jun. Value around 12,000.
  for (let i = 0; i < 27; i++) {
    const month = i % 6;
    const createdAt = getDateInMonth(month, i * 4 + 2);
    const createdDate = new Date(createdAt);
    const owner = SEED_OWNERS[i % SEED_OWNERS.length];
    
    const leadName = `${firstNames[(i * 5 + 4) % firstNames.length]} ${lastNames[(i * 4 + 3) % lastNames.length]}`;
    const company = companies[(i * 3 + 2) % companies.length];

    const sourceIndex = (i * 19) % 100;
    let source = 'LinkedIn';
    if (sourceIndex < 38) source = 'LinkedIn';
    else if (sourceIndex < 63) source = 'Referral';
    else if (sourceIndex < 81) source = 'Website';
    else if (sourceIndex < 89) source = 'Instagram';
    else if (sourceIndex < 95) source = 'Ads';
    else source = 'Cold Email';

    leads.push({
      id: `lead_${String(idCounter++).padStart(3, '0')}`,
      name: leadName,
      company: company,
      email: `${leadName.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: `+91 99999${String(10000 + idCounter).slice(1)}`,
      status: 'Lost',
      source,
      value: 12000,
      createdAt,
      date: createdAt.slice(0, 10),
      contactedAt: new Date(createdDate.getTime() + 1.2 * 24 * 60 * 60 * 1000).toISOString(),
      meetingAt: new Date(createdDate.getTime() + 3.8 * 24 * 60 * 60 * 1000).toISOString(),
      lostAt: new Date(createdDate.getTime() + 8.5 * 24 * 60 * 60 * 1000).toISOString(),
      owner
    });
  }

  // Double check our source counts to make them match precisely:
  // Target: LinkedIn 48, Referral 31, Website 22, Instagram 10, Ads 8, Cold Email 5
  // Total leads is 124.
  // Let's count sources of current array and adjust.
  const counts = { LinkedIn: 0, Referral: 0, Website: 0, Instagram: 0, Ads: 0, 'Cold Email': 0 };
  leads.forEach(l => { counts[l.source] = (counts[l.source] || 0) + 1; });
  
  // Let's force override sources to guarantee exact counts!
  const targetSources = [
    ...Array(48).fill('LinkedIn'),
    ...Array(31).fill('Referral'),
    ...Array(22).fill('Website'),
    ...Array(10).fill('Instagram'),
    ...Array(8).fill('Ads'),
    ...Array(5).fill('Cold Email')
  ];
  
  // Shuffle/assign source deterministically
  leads.forEach((l, idx) => {
    l.source = targetSources[idx] || 'Website';
  });

  return leads;
};

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState(() => {
    try {
      const stored = localStorage.getItem('crm_leads');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse leads from local storage', e);
    }
    
    // Seed and store in localStorage
    const seeded = generateMockLeads();
    localStorage.setItem('crm_leads', JSON.stringify(seeded));
    return seeded;
  });

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10),
      owner: leadData.owner || SEED_OWNERS[Math.floor(Math.random() * SEED_OWNERS.length)]
    };
    
    // Set stage dates based on creation status
    if (newLead.status === 'Won') {
      newLead.wonAt = newLead.createdAt;
    } else if (newLead.status === 'Lost') {
      newLead.lostAt = newLead.createdAt;
    } else if (newLead.status === 'Proposal Sent') {
      newLead.proposalAt = newLead.createdAt;
    } else if (newLead.status === 'Meeting Scheduled') {
      newLead.meetingAt = newLead.createdAt;
    } else if (newLead.status === 'Contacted') {
      newLead.contactedAt = newLead.createdAt;
    }

    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLead = (id, updatedData) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          const merged = { ...lead, ...updatedData };
          
          // Inject wonAt/lostAt/etc timestamps if transition happens and timestamp is not present
          if (merged.status === 'Won' && !merged.wonAt) {
            merged.wonAt = new Date().toISOString();
          } else if (merged.status === 'Lost' && !merged.lostAt) {
            merged.lostAt = new Date().toISOString();
          } else if (merged.status === 'Proposal Sent' && !merged.proposalAt) {
            merged.proposalAt = new Date().toISOString();
          } else if (merged.status === 'Meeting Scheduled' && !merged.meetingAt) {
            merged.meetingAt = new Date().toISOString();
          } else if (merged.status === 'Contacted' && !merged.contactedAt) {
            merged.contactedAt = new Date().toISOString();
          }

          return merged;
        }
        return lead;
      })
    );
  };

  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  return (
    <LeadContext.Provider value={{ leads, setLeads, addLead, updateLead, deleteLead }}>
      {children}
    </LeadContext.Provider>
  );
};
