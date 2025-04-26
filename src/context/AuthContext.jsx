import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  isAuthenticated,
  refreshToken,
} from "../services/auth.service";

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state from localStorage and check token validity
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const user = getCurrentUser();
        setCurrentUser(user);

        // If there is a user but token might be expired, try to refresh
        if (user && !tokenRefreshed) {
          // Only try to refresh token once to avoid infinite loops
          setTokenRefreshed(true);
          await refreshToken();
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [tokenRefreshed]);

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRegister(userData);

      // Backend returns response with { success, message, data: { user, token } }
      if (response.success && response.data.user) {
        setCurrentUser(response.data.user);
        // Navigate to dashboard after successful registration
        navigate("/dashboard");
      }

      return response;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiLogin(credentials);

      // Backend returns response with { success, message, data: { user, token } }
      if (response.success && response.data.user) {
        setCurrentUser(response.data.user);
        // Navigate to dashboard after successful login
        navigate("/dashboard");
      }

      return response;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    apiLogout();
    setCurrentUser(null);
    navigate("/login");
  };

  // Check if user is authenticated
  const authenticated = isAuthenticated();

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    authenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
