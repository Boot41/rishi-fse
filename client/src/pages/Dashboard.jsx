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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch all user data in one call
        const response = await fetch("http://localhost:8000/api/dashboard/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setUser(data);
        setProfile(data.financial_profile);
        setIncomes(data.incomes);
        setExpenses(data.expenses);
        setInvestments(data.investments);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Calculate totals including monthly salary
  const totalIncome = incomes.reduce(
    (sum, income) => sum + parseFloat(income.amount),
    profile ? parseFloat(profile.monthly_salary) : 0
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

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const groupIncomesBySource = (incomes, monthlySalary) => {
    const grouped = incomes.reduce((acc, income) => {
      const source = income.source;
      if (!acc[source]) {
        acc[source] = 0;
      }
      acc[source] += parseFloat(income.amount);
      return acc;
    }, { "Monthly Salary": monthlySalary || 0 });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
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
  const [incomesBySource, setIncomesBySource] = useState(() =>
    groupIncomesBySource(incomes, profile ? profile.monthly_salary : 0)
  );

  useEffect(() => {
    // Update all charts when data changes
    setExpensesByCategory(groupExpensesByCategory(expenses));
    setInvestmentPerformance(prepareInvestmentData(investments));
    setInvestmentsByType(groupInvestmentsByType(investments));
    setIncomesBySource(groupIncomesBySource(incomes, profile ? profile.monthly_salary : 0));
  }, [incomes, expenses, investments, profile]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No Data!</strong>
          <span className="block sm:inline"> Please complete your financial profile first.</span>
          <Link to="/onboarding" className="text-blue-500 hover:text-blue-700 underline ml-2">
            Go to Onboarding
          </Link>
        </div>
      </div>
    );
  }

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

          {/* Income Distribution */}
          <div className="bg-gray-800 rounded-lg p-6 col-span-1">
            <h3 className="text-xl font-semibold mb-4">Income Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={groupIncomesBySource(incomes, profile?.monthly_salary)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {groupIncomesBySource(incomes, profile?.monthly_salary).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
