import api from './api.js';

/**
 * Authentication service functions coordinating register, login, session lookup, and profile updating.
 */
const authService = {
  /**
   * Registers a new user.
   * 
   * @param {string} name - User's full name.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} The server response data containing token and user profile.
   */
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Logs in a user.
   * 
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} The server response data containing token and user profile.
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * Logs out the user on the client side by purging local credentials.
   * 
   * @returns {void}
   */
  logout: () => {
    localStorage.removeItem('crm-token');
  },

  /**
   * Retrieves the logged-in user's profile metadata.
   * 
   * @returns {Promise<Object>} The user document payload response.
   */
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Modifies profile values (e.g. name, password updates).
   * 
   * @param {Object} data - Key-value map of profile changes.
   * @returns {Promise<Object>} The updated user document payload response.
   */
  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },
};

export default authService;
export { authService };
