import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

function ExpenseDetails({ data, updateData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEditing = location.state?.isEditing;

  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date_spent: "",
  });

  useEffect(() => {
    // If we're in edit mode, initialize with existing data
    if (isEditing && location.state?.expenses) {
      updateData(location.state.expenses);
    }
  }, [isEditing, location.state?.expenses, updateData]);

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.date_spent) {
      updateData([...data, { ...newExpense }]);
      setNewExpense({ category: "", amount: "", date_spent: "" });
    }
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = data.filter((_, i) => i !== index);
    updateData(updatedExpenses);
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    updateData(newData);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const categories = [
    "Rent",
    "Utilities",
    "Groceries",
    "Transportation",
    "Entertainment",
    "Other"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {isEditing ? 'Edit Expense Details' : 'Expense Details'}
        </h2>
        {isEditing && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Add New Expense */}
      <div className="bg-zinc-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4 text-zinc-300">Add Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="" className="bg-zinc-800 text-white">Select category</option>
            {categories.map(category => (
              <option key={category} value={category} className="bg-zinc-800 text-white">
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: Number(e.target.value) })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
            placeholder="Amount"
          />
          <input
            type="date"
            value={newExpense.date_spent}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date_spent: e.target.value })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <button
          onClick={handleAddExpense}
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white"
        >
          <FiPlus className="mr-2" />
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        {data.map((expense, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-800 p-4 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={expense.category}
                onChange={(e) => handleChange(index, "category", e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-zinc-800 text-white">
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => handleChange(index, "amount", Number(e.target.value))}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                placeholder="Amount"
              />
              <input
                type="date"
                value={expense.date_spent}
                onChange={(e) => handleChange(index, "date_spent", e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleRemoveExpense(index)}
                className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <FiTrash2 />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ExpenseDetails;
