import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

function ExpenseManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    category: "",
    date_spent: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch expenses when component mounts
    const fetchExpenses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/api/expense/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch expenses");
        }
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    setIsLoading(true);
    setError(null);
    
    try {
      if (editingId) {
        // Update existing expense
        const response = await fetch(`http://localhost:8000/api/expense/${editingId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(expenseData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to update expense");
        }
        
        const updatedExpense = await response.json();
        // Update local state
        setExpenses(expenses.map(expense => 
          expense.id === editingId ? updatedExpense : expense
        ));
        setEditingId(null);
      } else {
        // Create new expense
        const response = await fetch("http://localhost:8000/api/expense/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(expenseData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to create expense");
        }
        
        const newExpense = await response.json();
        setExpenses([...expenses, newExpense]);
      }
      
      // Reset form
      setExpenseData({ description: "", amount: "", category: "", date_spent: "" });
    } catch (error) {
      setError(error.message);
      console.error("Error saving expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setExpenseData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date_spent: expense.date_spent,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/expense/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete expense");
      }
      
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      setError(error.message);
      console.error("Error deleting expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "Food",
    "Transportation",
    "Housing",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Other"
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
            {editingId ? "Edit Expense" : "Add Expense"}
          </h2>
          <p className="mt-2 text-center text-gray-400">
            {editingId ? "Update your expense entry" : "Add a new expense entry"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="text-sm font-medium text-gray-300 block mb-2">Description</label>
              <input
                id="description"
                name="description"
                type="text"
                required
                value={expenseData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter expense description"
              />
            </div>
            <div>
              <label htmlFor="amount" className="text-sm font-medium text-gray-300 block mb-2">Amount</label>
              <input
                id="amount"
                name="amount"
                type="number"
                required
                value={expenseData.amount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label htmlFor="category" className="text-sm font-medium text-gray-300 block mb-2">Category</label>
              <select
                id="category"
                name="category"
                required
                value={expenseData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date_spent" className="text-sm font-medium text-gray-300 block mb-2">Date Spent</label>
              <input
                id="date_spent"
                name="date_spent"
                type="date"
                required
                value={expenseData.date_spent}
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
              {editingId ? "Update Expense" : "Add Expense"}
            </motion.button>
            {editingId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setExpenseData({ description: "", amount: "", category: "", date_spent: "" });
                }}
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </form>

        <h3 className="text-lg font-semibold text-white">Current Expenses</h3>
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li key={expense.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
              <div>
                <p className="text-white">{expense.description} - ₹{expense.amount}</p>
                <p className="text-gray-400">Category: {expense.category}</p>
                <p className="text-gray-400">Date: {expense.date_spent}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(expense)}
                  className="text-indigo-500 hover:text-indigo-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
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

export default ExpenseManagement;
