import api from './api.js';

/**
 * Utility helper to map Mongoose Database Object IDs (`_id`) to frontend expected `id` fields.
 * Ensures backward compatibility with existing mock UI components.
 * 
 * @param {Object} lead - The raw lead document from the backend database.
 * @returns {Object} The formatted lead with `id` key attached.
 */
const mapLead = (lead) => {
  if (!lead) return lead;
  return {
    ...lead,
    id: lead._id,
  };
};

/**
 * Lead service module managing backend API CRUD requests and statistics retrievals.
 */
const leadService = {
  /**
   * Fetch leads with support for filtering and searching.
   * 
   * @param {Object} params - Query params (status, search, page, limit, sortBy, sortOrder).
   * @returns {Promise<Object>} The API response payload wrapping paginated data.
   */
  getLeads: async (params) => {
    const response = await api.get('/api/leads', { params });
    if (response.data && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapLead);
    }
    return response.data;
  },

  /**
   * Create a new lead record.
   * 
   * @param {Object} leadData - Lead fields to store.
   * @returns {Promise<Object>} The API response payload wrapping the new lead.
   */
  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData);
    if (response.data && response.data.data) {
      response.data.data = mapLead(response.data.data);
    }
    return response.data;
  },

  /**
   * Update lead properties.
   * 
   * @param {string} id - Database lead ID.
   * @param {Object} leadData - Updated fields.
   * @returns {Promise<Object>} The API response payload wrapping the updated lead.
   */
  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    if (response.data && response.data.data) {
      response.data.data = mapLead(response.data.data);
    }
    return response.data;
  },

  /**
   * Update only the pipeline status of a lead.
   * 
   * @param {string} id - Database lead ID.
   * @param {string} status - New pipeline state.
   * @returns {Promise<Object>} The API response payload wrapping the updated lead.
   */
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    if (response.data && response.data.data) {
      response.data.data = mapLead(response.data.data);
    }
    return response.data;
  },

  /**
   * Delete a lead document.
   * 
   * @param {string} id - Database lead ID.
   * @returns {Promise<Object>} The delete operation API response.
   */
  deleteLead: async (id) => {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },

  /**
   * Fetch lead distribution and conversion stats.
   * Connects to GET /api/leads/stats on the backend server.
   * 
   * @returns {Promise<Object>} The stats payload.
   */
  getLeadStats: async () => {
    const response = await api.get('/api/leads/stats');
    return response.data;
  },

  /**
   * Fetch monthly deal volumes for the past 6 months.
   * Connects to GET /api/leads/monthly-stats on the backend server.
   * 
   * @returns {Promise<Object>} The monthly timeline dataset payload.
   */
  getMonthlyStats: async () => {
    const response = await api.get('/api/leads/monthly-stats');
    return response.data;
  },
};

export default leadService;
export { leadService };
