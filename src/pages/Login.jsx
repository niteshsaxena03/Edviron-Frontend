import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Initialize dark mode from localStorage if available
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Update localStorage and apply dark mode class when darkMode state changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
      // Navigation is handled in the AuthContext after successful login
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle guest login
  const handleGuestLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      await login({
        email: "nitesh04@gmail.com",
        password: "11111111",
      });
      // Navigation is handled in the context
    } catch (err) {
      setError(err.message || "Guest login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"} transition-colors duration-300`}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            // Sun icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            // Moon icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-md mx-auto mt-16 sm:mt-6">
        <h2
          className={`text-center text-2xl sm:text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          School Payment Portal
        </h2>
        <p
          className={`mt-2 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 w-full sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"} py-6 sm:py-8 px-4 sm:px-10 shadow sm:rounded-lg transition-colors duration-300`}
        >
          {error && (
            <div
              className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 sm:py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 sm:py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm mt-2 sm:mt-0">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          {/* Guest Login Button */}
          <div className="mt-4">
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className={`w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              Guest Login
            </button>
            <p
              className={`mt-2 text-xs text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            ></p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}
                >
                  New user?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
