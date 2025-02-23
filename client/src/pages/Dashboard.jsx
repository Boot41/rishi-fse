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
  const [aiInsights, setAiInsights] = useState([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState(null);
  const [similarInvestments, setSimilarInvestments] = useState(null);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [similarError, setSimilarError] = useState(null);

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

  // Fetch AI insights
  useEffect(() => {
    const fetchAiInsights = async () => {
      setIsLoadingInsights(true);
      setInsightsError(null);
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch("http://localhost:8000/api/ai/insights/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI insights");
        }

        const { advice } = await response.json();
        // Process the advice string into separate insights
        const insights = advice
          .split(/\d+\.\s+/) // Split by numbered points (e.g., "1. ", "2. ")
          .filter(text => text.trim().length > 0) // Remove empty strings
          .map(text => text.trim()); // Clean up whitespace
        
        setAiInsights(insights);
      } catch (err) {
        setInsightsError(err.message);
        console.error("Error fetching AI insights:", err);
      } finally {
        setIsLoadingInsights(false);
      }
    };

    if (profile) {
      fetchAiInsights();
    }
  }, [profile]);

  // Fetch similar investments
  useEffect(() => {
    const fetchSimilarInvestments = async () => {
      setIsLoadingSimilar(true);
      setSimilarError(null);
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch("http://localhost:8000/api/ai/similar-investments/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch similar investments");
        }

        const { recommendations } = await response.json();
        // Process the recommendations string into an array
        const recommendationsList = recommendations
          .split(/\d+\.\s+/) // Split by numbered points (e.g., "1. ", "2. ")
          .filter(text => text.trim().length > 0) // Remove empty strings
          .map(text => {
            const [name, ...details] = text.split(':');
            return {
              name: name.trim().replace(/\*+/g, ''), // Remove all asterisks from the name
              details: details.join(':').trim()
            };
          });
        
        setSimilarInvestments(recommendationsList);
      } catch (err) {
        setSimilarError(err.message);
        console.error("Error fetching similar investments:", err);
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    if (profile && investments.length > 0) {
      fetchSimilarInvestments();
    }
  }, [profile, investments]);

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

  // Function to process insight text
  const processInsightText = (text) => {
    const headingMatch = text.match(/\*\*(.*?)\*\*/);
    if (headingMatch) {
      const [fullMatch, heading] = headingMatch;
      const description = text.replace(fullMatch, '').trim();
      // Remove the colon if it's the first character of the description
      const cleanDescription = description.startsWith(':') ? description.slice(1).trim() : description;
      return { heading, description: cleanDescription };
    }
    return { heading: '', description: text };
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

          {/* AI Insights Section */}
          <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2 shadow-xl overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-repeat" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Financial Insights</h2>
                    <p className="text-gray-400 text-sm">Powered by advanced financial analysis</p>
                  </div>
                </div>
                {isLoadingInsights && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                )}
              </div>
              
              {insightsError ? (
                <div className="text-red-400 p-4 rounded-lg bg-red-900/20 border border-red-700/50">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error loading insights: {insightsError}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => {
                    const { heading, description } = processInsightText(insight);
                    return (
                      <div 
                        key={index} 
                        className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl hover:bg-gray-800/80 transition-all duration-300 border border-gray-700/50"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-50"></div>
                              <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            {heading && (
                              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {heading}
                              </h3>
                            )}
                            <p className="text-white text-base leading-relaxed tracking-wide">
                              {description}
                            </p>
                            {/* Add relevant icon based on insight content */}
                            {(heading + description).toLowerCase().includes('save') && (
                              <div className="mt-2 text-purple-400 text-sm flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Savings Opportunity</span>
                              </div>
                            )}
                            {(heading + description).toLowerCase().includes('invest') && (
                              <div className="mt-2 text-pink-400 text-sm flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span>Investment Insight</span>
                              </div>
                            )}
                            {(heading + description).toLowerCase().includes('risk') && (
                              <div className="mt-2 text-yellow-400 text-sm flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Risk Assessment</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Chat with AI Button */}
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => navigate("/ai-chat")}
                      className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md text-xl"
                    >
                      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </span>
                      <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                        Chat with AI Advisor
                      </span>
                      <span className="relative invisible">Chat with AI Advisor</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Investments Section */}
          <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">Similar Investment Opportunities</h2>
                  <p className="text-gray-400 text-sm">Based on your current portfolio</p>
                </div>
              </div>
              {isLoadingSimilar && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              )}
            </div>

            {similarError ? (
              <div className="text-red-400 p-4 rounded-lg bg-red-900/20 border border-red-700/50">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Error loading similar investments: {similarError}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarInvestments?.map((investment, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl hover:bg-gray-800/80 transition-all duration-300 border border-gray-700/50"
                  >
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">{investment.name}</h3>
                    <p className="text-gray-300 text-sm">{investment.details}</p>
                  </div>
                ))}
              </div>
            )}
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
