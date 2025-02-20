import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function IncomeManagement() {
  const [incomeData, setIncomeData] = useState({
    source: "",
    amount: "",
    date_received: "",
  });
  const [incomes, setIncomes] = useState([]);

  const handleChange = (e) => {
    setIncomeData({ ...incomeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIncomes([...incomes, { ...incomeData, id: incomes.length + 1 }]);
    setIncomeData({ source: "", amount: "", date_received: "" }); // Reset form
  };

  const handleDelete = (id) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl"
      >
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Manage Income</h2>
          <p className="mt-2 text-center text-gray-400">Add or delete your income entries</p>
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

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Income
            </motion.button>
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
              <button
                onClick={() => handleDelete(income.id)}
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

export default IncomeManagement;
