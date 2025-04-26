import { Link } from "react-router-dom";
import "../index.css";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col justify-center items-center p-4">
      <div className="text-center">
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
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-8 py-4 bg-yellow-400 text-gray-800 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="mt-16 text-white text-center">
        <p className="mb-2">Secure • Fast • Reliable</p>
        <p>The ultimate solution for school payment management</p>
      </div>
    </div>
  );
};

export default HomePage;
