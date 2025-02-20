import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function InvestmentManagement() {
  const [investmentData, setInvestmentData] = useState({
    name: "",
    investment_type: "",
    amount_invested: "",
    current_value: "",
    date_invested: "",
  });
  const [investments, setInvestments] = useState([]);

  const handleChange = (e) => {
    setInvestmentData({ ...investmentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInvestments([...investments, { ...investmentData, id: investments.length + 1 }]);
    setInvestmentData({ name: "", investment_type: "", amount_invested: "", current_value: "", date_invested: "" }); // Reset form
  };

  const handleDelete = (id) => {
    setInvestments(investments.filter((investment) => investment.id !== id));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl"
      >
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Manage Investments</h2>
          <p className="mt-2 text-center text-gray-400">Add or delete your investment entries</p>
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
              <label htmlFor="investment_type" className="text-sm font-medium text-gray-300 block mb-2">Investment Type</label>
              <input
                id="investment_type"
                name="investment_type"
                type="text"
                required
                value={investmentData.investment_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-gray-800 focus:ring-0 text-white px-4 py-3"
                placeholder="Enter investment type"
              />
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
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Investment
            </motion.button>
          </div>
        </form>

        <h3 className="text-lg font-semibold text-white">Current Investments</h3>
        <ul className="space-y-2">
          {investments.map((investment) => (
            <li key={investment.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
              <div>
                <p className="text-white">{investment.name} - ₹{investment.amount_invested}</p>
                <p className="text-gray-400">Invested on: {investment.date_invested}</p>
              </div>
              <button
                onClick={() => handleDelete(investment.id)}
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

export default InvestmentManagement;
