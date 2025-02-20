import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  RiMoneyDollarCircleLine,
  RiPieChartLine,
  RiRobot2Line,
} from "react-icons/ri";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: "John",
  });
  const [profile, setProfile] = useState({
    age: 30,
    risk_tolerance: "medium",
  });
  const [incomes, setIncomes] = useState([
    { id: 1, source: "Salary", amount: 50000, date_received: "2025-02-01" },
    { id: 2, source: "Freelancing", amount: 15000, date_received: "2025-02-15" },
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Rent", amount: 20000, date_spent: "2025-02-05" },
    { id: 2, category: "Groceries", amount: 5000, date_spent: "2025-02-10" },
  ]);
  const [investments, setInvestments] = useState([
    { id: 1, name: "ABC Mutual Fund", investment_type: "mutual_funds", amount_invested: 10000, current_value: 12000, date_invested: "2025-01-01" },
    { id: 2, name: "XYZ Stocks", investment_type: "stocks", amount_invested: 15000, current_value: 18000, date_invested: "2025-01-15" },
  ]);

  const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalInvestments = investments.reduce((sum, inv) => sum + parseFloat(inv.amount_invested), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome, {user.first_name}</h1>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="text-gray-300 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <RiMoneyDollarCircleLine className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold">Total Income</h2>
            </div>
            <p className="text-3xl font-bold text-green-500">₹{totalIncome.toFixed(2)}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <RiPieChartLine className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold">Total Expenses</h2>
            </div>
            <p className="text-3xl font-bold text-red-500">₹{totalExpenses.toFixed(2)}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <RiRobot2Line className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-semibold">Investments</h2>
            </div>
            <p className="text-3xl font-bold text-indigo-500">₹{totalInvestments.toFixed(2)}</p>
          </motion.div>
        </div>

        {/* Financial Profile Summary */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Financial Profile Summary</h2>
          <p className="text-md text-gray-400">Age: {profile.age}</p>
          <p className="text-md text-gray-400">Risk Tolerance: {profile.risk_tolerance}</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
