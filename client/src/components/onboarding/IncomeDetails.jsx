import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

function IncomeDetails({ data, onChange, errors: propsErrors }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEditing = location.state?.isEditing;

  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    frequency: "monthly",
    date_received: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If we're in edit mode, initialize with existing data
    if (isEditing && location.state?.incomes) {
      onChange(location.state.incomes);
    }
  }, [isEditing, location.state?.incomes, onChange]);

  const handleAddIncome = () => {
    const validationErrors = {};
    if (!newIncome.source.trim()) {
      validationErrors.source = "Source is required";
    }
    if (!newIncome.amount) {
      validationErrors.amount = "Amount is required";
    }
    if (!newIncome.date_received) {
      validationErrors.date_received = "Date is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onChange([...data, { ...newIncome, amount: Number(newIncome.amount) }]);
    setNewIncome({
      source: "",
      amount: "",
      frequency: "monthly",
      date_received: "",
    });
    setErrors({});
  };

  const handleRemoveIncome = (index) => {
    const updatedIncome = data.filter((_, i) => i !== index);
    onChange(updatedIncome);
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {isEditing
            ? "Edit Additional Income Details"
            : "Additional Income Details"}
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

      {/* Add New Income */}
      <div className="bg-zinc-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4 text-zinc-300">
          Additional Income
        </h3>
        {propsErrors?.general && (
          <p className="text-red-500 text-sm">{propsErrors.general}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={newIncome.source}
            onChange={(e) =>
              setNewIncome({ ...newIncome, source: e.target.value })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
            placeholder="Source"
          />
          {errors.source && (
            <p className="text-red-500 text-sm mt-1">{errors.source}</p>
          )}
          <input
            type="number"
            value={newIncome.amount}
            onChange={(e) =>
              setNewIncome({ ...newIncome, amount: e.target.value })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
            placeholder="Amount"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
          <input
            type="date"
            value={newIncome.date_received}
            onChange={(e) =>
              setNewIncome({ ...newIncome, date_received: e.target.value })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
          {errors.date_received && (
            <p className="text-red-500 text-sm mt-1">{errors.date_received}</p>
          )}
        </div>
        <button
          onClick={handleAddIncome}
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white"
        >
          <FiPlus className="mr-2" />
          Add Income
        </button>
      </div>

      {/* Income List */}
      <div className="space-y-4">
        {data.map((income, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-800 p-4 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  value={income.source}
                  onChange={(e) => handleChange(index, "source", e.target.value)}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                  placeholder="Source"
                />
                {propsErrors?.items?.[index]?.source && (
                  <p className="mt-1 text-sm text-red-500">
                    {propsErrors.items[index].source}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  value={income.amount}
                  onChange={(e) =>
                    handleChange(index, "amount", Number(e.target.value))
                  }
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                  placeholder="Amount"
                  min="0"
                />
                {propsErrors?.items?.[index]?.amount && (
                  <p className="mt-1 text-sm text-red-500">
                    {propsErrors.items[index].amount}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="date"
                  value={income.date_received}
                  onChange={(e) =>
                    handleChange(index, "date_received", e.target.value)
                  }
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                />
                {propsErrors?.items?.[index]?.date_received && (
                  <p className="mt-1 text-sm text-red-500">
                    {propsErrors.items[index].date_received}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleRemoveIncome(index)}
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

export default IncomeDetails;
