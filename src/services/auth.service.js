import api from "./api";
import axios from "axios";
import { API_URL } from "../config";

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);

    // Store token and user data if login is successful
    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Registration API error:", error.response || error);

    // Get the error message from the API response if available
    if (error.response && error.response.data) {
      throw error.response.data;
    }

    throw { message: "An error occurred during registration" };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);

    // Store token and user data if login is successful
    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error.response || error);

    // Get the error message from the API response if available
    if (error.response && error.response.data) {
      throw error.response.data;
    }

    throw { message: "An error occurred during login" };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get valid token or attempt to refresh if needed
export const getRealToken = async () => {
  const token = localStorage.getItem("token");

  // If token exists, return it
  if (token) {
    return token;
  }

  // If no token, try to refresh
  const refreshed = await refreshToken();
  if (refreshed) {
    return localStorage.getItem("token");
  }

  // If refresh failed, throw error
  throw new Error("Failed to get authentication token");
};

// Refresh authentication token
export const refreshToken = async () => {
  try {
    // Use the guest credentials to get a new token
    const response = await api.post("/users/login", {
      email: "nitesh04@gmail.com",
      password: "11111111",
    });

    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      if (response.data.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};
