import axios from "axios";

const API_URL ="https://edviron-backend-2.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle token expiration
    if (response && response.status === 401) {
      console.log("Unauthorized access detected, redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // In a real app, you would redirect to login here
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
