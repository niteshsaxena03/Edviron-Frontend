import { Link } from "react-router-dom";
import "../index.css";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-blue-600 filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-500 filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-600 filter blur-3xl"></div>
      </div>

      <div className="text-center z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-pulse">
          Welcome to School Payment Portal
        </h1>
        <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
          Manage school transactions, track payments, and access your dashboard
          with ease
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg backdrop-blur-sm bg-opacity-90"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg backdrop-blur-sm bg-opacity-90"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="mt-16 text-white text-center z-10">
        <p className="mb-2">Secure • Fast • Reliable</p>
        <p>The ultimate solution for school payment management</p>
      </div>

      {/* GitHub Repository Links */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 z-10">
        <a
          href="https://github.com/niteshsaxena03/Edviron-Frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          Frontend Repo
        </a>
        <a
          href="https://github.com/niteshsaxena03/Edviron-Backend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          Backend Repo
        </a>
      </div>

      <div className="absolute bottom-6 text-center z-10 w-full">
        <div className="bg-black bg-opacity-30 py-2 px-4 rounded-full inline-block backdrop-blur-sm">
          <p className="text-lg md:text-xl font-bold tracking-wide">
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Made by Nitesh Saxena
            </span>
            <span className="animate-bounce inline-flex ml-2 text-yellow-300">
              ✨
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
