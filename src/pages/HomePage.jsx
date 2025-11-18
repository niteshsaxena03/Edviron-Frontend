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

      <div className="absolute bottom-6 text-center z-10 w-full">
        <div className="bg-black bg-opacity-30 py-2 px-4 rounded-full inline-block backdrop-blur-sm">
          <p className="text-lg md:text-xl font-bold tracking-wide">
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Made by Aman
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
