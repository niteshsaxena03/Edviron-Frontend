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

// Real login to get a valid token from the server
export const getRealToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email: "nitesh04@gmail.com",
      password: "11111111",
    });

    console.log("Login response:", response.data);

    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      if (response.data.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      console.log("✅ Authenticated successfully with a real token!");
      return true;
    } else {
      console.error("Token not found in response:", response.data);
      return false;
    }
  } catch (error) {
    console.error(
      "Failed to get real token:",
      error.response?.data || error.message
    );
    return false;
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
