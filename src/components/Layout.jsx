import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        &copy; {new Date().getFullYear()} School Payment Portal. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Layout;
