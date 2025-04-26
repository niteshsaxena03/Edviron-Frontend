import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";

const Layout = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900" : "bg-gray-100"} transition-colors duration-300`}
    >
      <Navbar />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      <footer
        className={`${darkMode ? "bg-gray-900 border-t border-gray-800" : "bg-gray-800"} text-white p-4 text-center text-sm transition-colors duration-300`}
      >
        &copy; {new Date().getFullYear()} School Payment Portal. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Layout;
