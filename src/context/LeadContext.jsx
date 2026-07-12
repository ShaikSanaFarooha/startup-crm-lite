import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService.js';
import { useAuth } from './AuthContext.jsx';

export const LeadContext = createContext(null);

/**
 * LeadProvider Component
 * Manages Lead CRUD states, coordinating asynchronous database updates with reactive toast notifications.
 */
export const LeadProvider = ({ children }) => {
  const { token } = useAuth();

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 1000,
    pages: 1,
  });

  /**
   * Fetch leads list from backend.
   * 
   * @async
   * @function fetchLeads
   * @param {Object} [params] - Optional query parameters (status, search, page, limit, sortBy, sortOrder).
   */
  const fetchLeads = async (params = {}) => {
    setIsLoading(true);
    try {
      // Default to loading up to 1000 items to support existing client-side filters/stats calculations
      const defaultParams = { limit: 1000, ...params };
      const response = await leadService.getLeads(defaultParams);
      
      // Backend returns response as { success: true, data: leadsArray, pagination: {...} }
      setLeads(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to fetch leads from server.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically fetch leads on mount or when the authorization token changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        fetchLeads();
      } else {
        setLeads([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [token]);

  /**
   * Captures a new lead on the backend and prepends it to local state.
   * 
   * @async
   * @function addLead
   * @param {Object} leadData - Schema fields for the new lead.
   */
  const addLead = async (leadData) => {
    setIsLoading(true);
    try {
      const response = await leadService.createLead(leadData);
      const createdLead = response.data;
      
      setLeads((prev) => [createdLead, ...prev]);
      toast.success('New lead captured successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create lead.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates an existing lead record on the backend and updates local state.
   * 
   * @async
   * @function updateLead
   * @param {string} id - Database lead Object ID.
   * @param {Object} updatedData - Changes to apply.
   */
  const updateLead = async (id, updatedData) => {
    setIsLoading(true);
    try {
      // If status is updated, we call leadService.updateLeadStatus, else standard update
      let response;
      const isStatusOnly = Object.keys(updatedData).length === 1 && updatedData.status;

      if (isStatusOnly) {
        response = await leadService.updateLeadStatus(id, updatedData.status);
      } else {
        response = await leadService.updateLead(id, updatedData);
      }

      const updatedLead = response.data;
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? updatedLead : lead))
      );
      toast.success('Lead updated successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update lead.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Purges a lead record from the database and updates local state.
   * 
   * @async
   * @function deleteLead
   * @param {string} id - Database lead Object ID.
   */
  const deleteLead = async (id) => {
    setIsLoading(true);
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      toast.success('Lead deleted successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete lead.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        setLeads,
        isLoading,
        pagination,
        fetchLeads,
        addLead,
        updateLead,
        deleteLead,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export default LeadContext;
