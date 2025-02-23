import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

function InvestmentManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [investmentData, setInvestmentData] = useState({
    name: "",
    investment_type: "",
    amount_invested: "",
    current_value: "",
    date_invested: "",
    interest_rate: null,
    years: null,
  });
  const [investments, setInvestments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch investments when component mounts
    const fetchInvestments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/api/investment/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch investments");
        }
        const data = await response.json();
        setInvestments(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching investments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear interest_rate and years when switching to non-FD/SIP investments
    if (name === 'investment_type' && !['fd', 'sip'].includes(value)) {
      setInvestmentData(prev => ({
        ...prev,
        [name]: value,
        interest_rate: null,
        years: null
      }));
    } else if (name === 'years' || name === 'interest_rate') {
      // Convert empty string to null, otherwise convert to appropriate type
      const processedValue = value === '' ? null : 
        name === 'years' ? parseInt(value) : parseFloat(value);
      setInvestmentData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    } else {
      setInvestmentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare the data - ensure years and interest_rate are null for non-FD/SIP investments
      const submissionData = {
        ...investmentData,
        interest_rate: ['fd', 'sip'].includes(investmentData.investment_type) ? investmentData.interest_rate : null,
        years: ['fd', 'sip'].includes(investmentData.investment_type) ? investmentData.years : null
      };

      if (editingId) {
        // Update existing investment
        const response = await fetch(`http://localhost:8000/api/investment/${editingId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to update investment");
        }
        
        const updatedInvestment = await response.json();
        setInvestments(investments.map(investment => 
          investment.id === editingId ? updatedInvestment : investment
        ));
        setEditingId(null);
      } else {
        // Create new investment
        const response = await fetch("http://localhost:8000/api/investment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to create investment");
        }
        
        const newInvestment = await response.json();
        setInvestments([...investments, newInvestment]);
      }
      
      // Reset form
      setInvestmentData({
        name: "",
        investment_type: "",
        amount_invested: "",
        current_value: "",
        date_invested: "",
        interest_rate: null,
        years: null,
      });
    } catch (error) {
      setError(error.message);
      console.error("Error saving investment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (investment) => {
    if (!investment || !investment.id) {
      setError("Invalid investment data for editing");
      return;
    }
    setEditingId(investment.id);
    setInvestmentData({
      name: investment.name || "",
      investment_type: investment.investment_type || "",
      amount_invested: investment.amount_invested || "",
      current_value: investment.current_value || "",
      date_invested: investment.date_invested || "",
      interest_rate: investment.interest_rate || null,
      years: investment.years || null,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/investment/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete investment");
      }
      
      setInvestments(investments.filter((investment) => investment.id !== id));
    } catch (error) {
      setError(error.message);
      console.error("Error deleting investment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const investmentTypes = [
    { value: "stocks", label: "Stocks" },
    { value: "sip", label: "SIP" },
    { value: "fd", label: "Fixed Deposit" },
    { value: "gold", label: "Gold" },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl"
      >
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            {editingId ? "Edit Investment" : "Add Investment"}
          </h2>
          <p className="mt-2 text-center text-gray-400">
            {editingId ? "Update your investment entry" : "Add a new investment entry"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-300 block mb-2">Investment Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={investmentData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter investment name"
              />
            </div>

            <div>
              <label htmlFor="investment_type" className="text-sm font-medium text-gray-300 block mb-2">Type</label>
              <select
                id="investment_type"
                name="investment_type"
                required
                value={investmentData.investment_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
              >
                <option value="">Select investment type</option>
                {investmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount_invested" className="text-sm font-medium text-gray-300 block mb-2">Amount Invested</label>
              <input
                id="amount_invested"
                name="amount_invested"
                type="number"
                required
                value={investmentData.amount_invested}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter amount invested"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="current_value" className="text-sm font-medium text-gray-300 block mb-2">Current Value</label>
              <input
                id="current_value"
                name="current_value"
                type="number"
                required
                value={investmentData.current_value}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter current value"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="date_invested" className="text-sm font-medium text-gray-300 block mb-2">Date Invested</label>
              <input
                id="date_invested"
                name="date_invested"
                type="date"
                required
                value={investmentData.date_invested}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
              />
            </div>

            {/* Show interest rate and years only for FD and SIP */}
            {['fd', 'sip'].includes(investmentData.investment_type) && (
              <>
                <div>
                  <label htmlFor="interest_rate" className="text-sm font-medium text-gray-300 block mb-2">
                    {investmentData.investment_type === 'fd' ? 'Interest Rate (%)' : 'Expected Return Rate (%)'}
                  </label>
                  <input
                    id="interest_rate"
                    name="interest_rate"
                    type="number"
                    required
                    value={investmentData.interest_rate === null ? '' : investmentData.interest_rate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                    placeholder={`Enter ${investmentData.investment_type === 'fd' ? 'interest' : 'expected return'} rate`}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor="years" className="text-sm font-medium text-gray-300 block mb-2">
                    {investmentData.investment_type === 'fd' ? 'Lock-in Period (Years)' : 'Investment Period (Years)'}
                  </label>
                  <input
                    id="years"
                    name="years"
                    type="number"
                    required
                    value={investmentData.years === null ? '' : investmentData.years}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                    placeholder={`Enter ${investmentData.investment_type === 'fd' ? 'lock-in' : 'investment'} period`}
                    min="0"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingId ? "Update Investment" : "Add Investment"}
            </motion.button>
            {editingId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setInvestmentData({
                    name: "",
                    investment_type: "",
                    amount_invested: "",
                    current_value: "",
                    date_invested: "",
                    interest_rate: null,
                    years: null,
                  });
                }}
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </form>

        <h3 className="text-lg font-semibold text-white">Current Investments</h3>
        <ul className="space-y-2">
          {investments.map((investment) => (
            <li key={investment.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
              <div>
                <p className="text-white">{investment.name} - ₹{investment.amount_invested}</p>
                <p className="text-gray-400">Type: {investment.investment_type}</p>
                <p className="text-gray-400">Expected Return: {investment.expected_return}%</p>
                <p className="text-gray-400">Date: {investment.date_invested}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(investment)}
                  className="text-indigo-500 hover:text-indigo-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(investment.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <Link to="/dashboard" className="text-indigo-500 hover:text-indigo-400">Back to Dashboard</Link>
      </motion.div>
    </div>
  );
}

export default InvestmentManagement;
