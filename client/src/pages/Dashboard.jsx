import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  RiMoneyDollarCircleLine,
  RiPieChartLine,
  RiRobot2Line,
  RiEditLine,
} from "react-icons/ri";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
    {
      id: 2,
      source: "Freelancing",
      amount: 15000,
      date_received: "2025-02-15",
    },
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Rent", amount: 20000, date_spent: "2025-02-05" },
    { id: 2, category: "Groceries", amount: 5000, date_spent: "2025-02-10" },
  ]);
  const [investments, setInvestments] = useState([
    {
      id: 1,
      name: "ABC Mutual Fund",
      investment_type: "mutual_funds",
      amount_invested: 10000,
      current_value: 12000,
      date_invested: "2025-01-01",
    },
    {
      id: 2,
      name: "XYZ Stocks",
      investment_type: "stocks",
      amount_invested: 15000,
      current_value: 18000,
      date_invested: "2025-01-15",
    },
  ]);

  const totalIncome = incomes.reduce(
    (sum, income) => sum + parseFloat(income.amount),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );
  const totalInvestments = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.amount_invested),
    0
  );

  // Helper functions for data transformation
  const groupExpensesByCategory = (expenses) => {
    const grouped = expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(expense.amount);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const groupInvestmentsByType = (investments) => {
    const grouped = investments.reduce((acc, investment) => {
      const type = investment.investment_type;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += parseFloat(investment.current_value);
      return acc;
    }, {});

    // Map investment types to more readable labels
    const typeLabels = {
      stocks: "Stocks",
      mutual_funds: "Mutual Funds",
      sip: "SIP",
      fd: "Fixed Deposit",
      gold: "Gold",
    };

    return Object.entries(grouped).map(([type, value]) => ({
      name: typeLabels[type] || type,
      value,
    }));
  };

  const prepareInvestmentData = (investments) => {
    return investments.map((inv) => ({
      name: inv.name,
      "Amount Invested": parseFloat(inv.amount_invested),
      "Current Value": parseFloat(inv.current_value),
    }));
  };

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884d8'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const [expensesByCategory, setExpensesByCategory] = useState(() =>
    groupExpensesByCategory(expenses)
  );
  const [investmentPerformance, setInvestmentPerformance] = useState(() =>
    prepareInvestmentData(investments)
  );
  const [investmentsByType, setInvestmentsByType] = useState(() =>
    groupInvestmentsByType(investments)
  );

  useEffect(() => {
    // Update all charts when data changes
    setExpensesByCategory(groupExpensesByCategory(expenses));
    setInvestmentPerformance(prepareInvestmentData(investments));
    setInvestmentsByType(groupInvestmentsByType(investments));
  }, [incomes, expenses, investments]);

  // Navigation handlers for edit buttons
  const handleEditProfile = () => {
    navigate("/onboarding/edit/profile", {
      state: {
        isEdit: true,
        data: profile,
      },
    });
  };

  const handleEditIncome = () => {
    navigate("/onboarding/edit/income", {
      state: {
        isEdit: true,
        data: incomes,
      },
    });
  };

  const handleEditExpenses = () => {
    navigate("/onboarding/edit/expenses", {
      state: {
        isEdit: true,
        data: expenses,
      },
    });
  };

  const handleEditInvestments = () => {
    navigate("/onboarding/edit/investments", {
      state: {
        isEdit: true,
        data: investments,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">Welcome, {user.first_name}</h1>
              <nav className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/ai-chat"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  AI Chat
                </Link>
              </nav>
            </div>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <RiMoneyDollarCircleLine className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold">Total Income</h2>
              </div>
              <button
                onClick={handleEditIncome}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Edit Income"
              >
                <RiEditLine className="w-5 h-5" />
              </button>
            </div>
            <p className="text-3xl font-bold text-green-500">
              ₹{totalIncome.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <RiPieChartLine className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold">Total Expenses</h2>
              </div>
              <button
                onClick={handleEditExpenses}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Edit Expenses"
              >
                <RiEditLine className="w-5 h-5" />
              </button>
            </div>
            <p className="text-3xl font-bold text-red-500">
              ₹{totalExpenses.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <RiRobot2Line className="w-6 h-6 text-indigo-500" />
                <h2 className="text-xl font-semibold">Investments</h2>
              </div>
              <button
                onClick={handleEditInvestments}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Edit Investments"
              >
                <RiEditLine className="w-5 h-5" />
              </button>
            </div>
            <p className="text-3xl font-bold text-indigo-500">
              ₹{totalInvestments.toFixed(2)}
            </p>
          </motion.div>
        </div>

        {/* Profile Edit Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleEditProfile}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit Profile"
          >
            <RiEditLine className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Investment Distribution by Type */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Investment Distribution by Type
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {investmentsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses Chart */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Investment Performance Chart */}
          <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Investment Performance
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Amount Invested" fill="#8884d8" />
                  <Bar dataKey="Current Value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Financial Profile Summary */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Financial Profile Summary</h2>
            <button
              onClick={() => navigate("/financial-onboarding")}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <RiEditLine className="w-5 h-5" />
            </button>
          </div>
          <p className="text-md text-gray-400">Age: {profile.age}</p>
          <p className="text-md text-gray-400">
            Risk Tolerance: {profile.risk_tolerance}
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
