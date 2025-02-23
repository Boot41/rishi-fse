import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

function IncomeManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [incomeData, setIncomeData] = useState({
    source: "",
    amount: "",
    date_received: "",
  });
  const [incomes, setIncomes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Check if we're in edit mode from navigation state
    const state = location.state;
    if (state?.isEdit && state?.data) {
      setIncomes(state.data);
    }

    // Fetch incomes when component mounts
    const fetchIncomes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/api/income/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch incomes");
        }
        const data = await response.json();
        setIncomes(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching incomes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we're not in edit mode
    if (!state?.isEdit) {
      fetchIncomes();
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    setIncomeData({ ...incomeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    setIsLoading(true);
    setError(null);
    
    try {
      if (editingId) {
        // Update existing income
        const response = await fetch(`http://localhost:8000/api/income/${editingId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(incomeData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to update income");
        }
        
        const updatedIncome = await response.json();
        // Update local state
        setIncomes(incomes.map(income => 
          income.id === editingId ? updatedIncome : income
        ));
        setEditingId(null);
      } else {
        // Create new income
        const response = await fetch("http://localhost:8000/api/income/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(incomeData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to create income");
        }
        
        const newIncome = await response.json();
        setIncomes([...incomes, newIncome]);
      }
      
      // Reset form
      setIncomeData({ source: "", amount: "", date_received: "" });
    } catch (error) {
      setError(error.message);
      console.error("Error saving income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (income) => {
    if (!income || !income.id) {
      setError("Invalid income data for editing");
      return;
    }
    setEditingId(income.id);
    setIncomeData({
      source: income.source || "",
      amount: income.amount || "",
      date_received: income.date_received || "",
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/income/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete income");
      }
      
      setIncomes(incomes.filter((income) => income.id !== id));
    } catch (error) {
      setError(error.message);
      console.error("Error deleting income:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            {editingId ? "Edit Income" : "Add Income"}
          </h2>
          <p className="mt-2 text-center text-gray-400">
            {editingId ? "Update your income entry" : "Add a new income entry"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="source" className="text-sm font-medium text-gray-300 block mb-2">Source</label>
              <input
                id="source"
                name="source"
                type="text"
                required
                value={incomeData.source}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter income source"
              />
            </div>
            <div>
              <label htmlFor="amount" className="text-sm font-medium text-gray-300 block mb-2">Amount</label>
              <input
                id="amount"
                name="amount"
                type="number"
                required
                value={incomeData.amount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label htmlFor="date_received" className="text-sm font-medium text-gray-300 block mb-2">Date Received</label>
              <input
                id="date_received"
                name="date_received"
                type="date"
                required
                value={incomeData.date_received}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingId ? "Update Income" : "Add Income"}
            </motion.button>
            {editingId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setIncomeData({ source: "", amount: "", date_received: "" });
                }}
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </form>

        <h3 className="text-lg font-semibold text-white">Current Incomes</h3>
        <ul className="space-y-2">
          {incomes.map((income) => (
            <li key={income.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
              <div>
                <p className="text-white">{income.source} - ₹{income.amount}</p>
                <p className="text-gray-400">Received on: {income.date_received}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(income)}
                  className="text-indigo-500 hover:text-indigo-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(income.id)}
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

export default IncomeManagement;
