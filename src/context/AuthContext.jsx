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

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const user = getCurrentUser();
        setCurrentUser(user);

        if (user && !tokenRefreshed) {
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

      if (response.success && response.data.user) {
        setCurrentUser(response.data.user);
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

  const logout = () => {
    apiLogout();
    setCurrentUser(null);
    navigate("/login");
  };

  const authenticated = isAuthenticated();

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
