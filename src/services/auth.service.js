import api from "./api";
import axios from "axios";
import { API_URL } from "../config";

export const register = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);

    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Registration API error:", error.response || error);

    if (error.response && error.response.data) {
      throw error.response.data;
    }

    throw { message: "An error occurred during registration" };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);

    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error.response || error);

    if (error.response && error.response.data) {
      throw error.response.data;
    }

    throw { message: "An error occurred during login" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

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

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRealToken = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    return token;
  }

  const refreshed = await refreshToken();
  if (refreshed) {
    return localStorage.getItem("token");
  }

  throw new Error("Failed to get authentication token");
};

export const refreshToken = async () => {
  try {
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
