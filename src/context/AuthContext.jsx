import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService.js';

// Create Auth Context
export const AuthContext = createContext(null);

/**
 * Authentication Provider component wrapping the React application.
 * Manages JWT tokens, user states, and session persistence.
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem('crm-token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user session on mount if token is found in localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const profileData = await authService.getProfile();
        // Backend returns response as { success: true, data: user }
        setUser(profileData.data);
      } catch (err) {
        console.error('Session restoration failed:', err);
        // Clear token locally if invalid/expired to prevent loop
        localStorage.removeItem('crm-token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Performs user login, sets local credentials, and updates states.
   * 
   * @param {string} email 
   * @param {string} password 
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      // Backend returns response as { success: true, data: { token, user } }
      const { token: userToken, user: userProfile } = result.data;

      localStorage.setItem('crm-token', userToken);
      setToken(userToken);
      setUser(userProfile);
      
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(errMsg);
      throw new Error(errMsg, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registers a new user account.
   * 
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.register(name, email, password);
      // Backend returns response as { success: true, data: { token, user } }
      const { token: userToken, user: userProfile } = result.data;

      localStorage.setItem('crm-token', userToken);
      setToken(userToken);
      setUser(userProfile);
      
      toast.success('Registration successful! Welcome.');
      navigate('/');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed.';
      toast.error(errMsg);
      throw new Error(errMsg, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the user and redirects to login portal.
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom React Hook to consume the AuthContext safely.
 * 
 * @returns {Object} Authentication context properties.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
