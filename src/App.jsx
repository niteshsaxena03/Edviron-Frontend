// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SchoolTransactions from "./pages/SchoolTransactions";
import TransactionStatus from "./pages/TransactionStatus";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/school-transactions" element={<SchoolTransactions />} />
        <Route path="/transaction-status" element={<TransactionStatus />} />
      </Routes>
    </Router>
  );
};

export default App;
