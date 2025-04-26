import { getRealToken } from "../services/auth.service";

/**
 * This file is for development and testing purposes only.
 * It provides a simple way to set up mock authentication without a real backend.
 */

/**
 * Set a test authentication token in localStorage
 * This is for development/testing purposes only
 */
export const setupTestAuth = async () => {
  try {
    // Try to get a real token first
    const success = await getRealToken();

    if (success) {
      return true;
    }

    // Fall back to mock token if real token fails
    console.warn("⚠️ Could not get a real token. Using mock token instead.");
    console.warn(
      "⚠️ Note: API calls requiring authentication will fail with this token."
    );

    localStorage.setItem("token", "test-token-for-development");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "1",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
      })
    );

    console.log("Test authentication set up with mock data.");
    return true;
  } catch (error) {
    console.error("Failed to set up test authentication:", error);
    return false;
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("Authentication data cleared!");
  return true;
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// You can run this in browser console to quickly set up authentication:
// import { setupTestAuth } from './utils/testAuth'
// setupTestAuth()
