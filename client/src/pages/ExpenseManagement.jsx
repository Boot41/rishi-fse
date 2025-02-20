import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ExpenseManagement() {
  const [expenseData, setExpenseData] = useState({
    category: "",
    amount: "",
    date_spent: "",
  });
  const [expenses, setExpenses] = useState([]);

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setExpenses([...expenses, { ...expenseData, id: expenses.length + 1 }]);
    setExpenseData({ category: "", amount: "", date_spent: "" }); // Reset form
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl"
      >
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Manage Expenses</h2>
          <p className="mt-2 text-center text-gray-400">Add or delete your expense entries</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="category" className="text-sm font-medium text-gray-300 block mb-2">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                required
                value={expenseData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter expense category"
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

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Expense
            </motion.button>
          </div>
        </form>

        <h3 className="text-lg font-semibold text-white">Current Expenses</h3>
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li key={expense.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
              <div>
                <p className="text-white">{expense.category} - ₹{expense.amount}</p>
                <p className="text-gray-400">Spent on: {expense.date_spent}</p>
              </div>
              <button
                onClick={() => handleDelete(expense.id)}
                className="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <Link to="/dashboard" className="text-indigo-500 hover:text-indigo-400">Back to Dashboard</Link>
      </motion.div>
    </div>
  );
}

export default ExpenseManagement;
