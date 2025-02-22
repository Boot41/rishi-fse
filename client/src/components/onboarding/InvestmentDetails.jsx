import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const investmentTypes = ["stocks", "mutual_funds", "sip", "fd", "gold"];

function InvestmentDetails({ data, onChange, errors: propsErrors }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEditing = location.state?.isEditing;

  const [newInvestment, setNewInvestment] = useState({
    name: "",
    investment_type: "",
    amount_invested: "",
    current_value: "",
    date_invested: "",
    interest_rate: "",
    years: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If we're in edit mode, initialize with existing data
    if (isEditing && location.state?.investments) {
      onChange(location.state.investments);
    }
  }, [isEditing, location.state?.investments, onChange]);

  const handleAddInvestment = () => {
    const validationErrors = {};
    if (!newInvestment.name) {
      validationErrors.name = "Name is required";
    }
    if (!newInvestment.investment_type) {
      validationErrors.investment_type = "Type is required";
    }
    if (!newInvestment.amount_invested) {
      validationErrors.amount_invested = "Amount is required";
    }
    if (!newInvestment.current_value) {
      validationErrors.current_value = "Current value is required";
    }
    if (!newInvestment.date_invested) {
      validationErrors.date_invested = "Date is required";
    }

    // Only validate interest_rate and years for SIP and FD
    if (["sip", "fd"].includes(newInvestment.investment_type)) {
      if (!newInvestment.interest_rate) {
        validationErrors.interest_rate = "Interest rate is required for SIP and FD";
      }
      if (!newInvestment.years) {
        validationErrors.years = "Years is required for SIP and FD";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare the investment data
    const investmentData = {
      ...newInvestment,
      // Set optional fields to null if not required
      interest_rate: ["sip", "fd"].includes(newInvestment.investment_type) 
        ? newInvestment.interest_rate 
        : null,
      years: ["sip", "fd"].includes(newInvestment.investment_type) 
        ? newInvestment.years 
        : null
    };

    onChange([...data, investmentData]);
    setNewInvestment({
      name: "",
      investment_type: "",
      amount_invested: "",
      current_value: "",
      date_invested: "",
      interest_rate: "",
      years: "",
    });
    setErrors({});
  };

  const handleRemoveInvestment = (index) => {
    const updatedInvestments = data.filter((_, i) => i !== index);
    onChange(updatedInvestments);
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSave = () => {
    if (data.length === 0) {
      // If no investments, navigate to dashboard
      navigate("/dashboard");
    } else {
      // Save investments logic (if needed)
      onChange(data);
      navigate("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {isEditing ? "Edit Investment Details" : "Investment Details"}
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

      {/* Add New Investment */}
      <div className="bg-zinc-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4 text-zinc-300">
          Add Investment
        </h3>
        {propsErrors?.general && (
          <p className="text-red-500 text-sm mb-4">{propsErrors.general}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            value={newInvestment.name}
            onChange={(e) =>
              setNewInvestment({ ...newInvestment, name: e.target.value })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
            placeholder="Investment Name"
          />
          <select
            value={newInvestment.investment_type}
            onChange={(e) =>
              setNewInvestment({
                ...newInvestment,
                investment_type: e.target.value,
              })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="" className="bg-zinc-800 text-white">
              Select Type
            </option>
            {investmentTypes.map((type) => (
              <option
                key={type}
                value={type}
                className="bg-zinc-800 text-white"
              >
                {type
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={newInvestment.amount_invested}
            onChange={(e) =>
              setNewInvestment({
                ...newInvestment,
                amount_invested: Number(e.target.value),
              })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
            placeholder="Amount Invested"
          />
          <input
            type="number"
            value={newInvestment.current_value}
            onChange={(e) =>
              setNewInvestment({
                ...newInvestment,
                current_value: Number(e.target.value),
              })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
            placeholder="Current Value"
          />
          <input
            type="date"
            value={newInvestment.date_invested}
            onChange={(e) =>
              setNewInvestment({
                ...newInvestment,
                date_invested: e.target.value,
              })
            }
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
          {["sip", "fd"].includes(newInvestment.investment_type) && (
            <>
              <input
                type="number"
                value={newInvestment.interest_rate}
                onChange={(e) =>
                  setNewInvestment({
                    ...newInvestment,
                    interest_rate: Number(e.target.value),
                  })
                }
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                placeholder="Interest Rate (%)"
                min="0.01"
                step="0.01"
              />
              <input
                type="number"
                value={newInvestment.years}
                onChange={(e) =>
                  setNewInvestment({
                    ...newInvestment,
                    years: Number(e.target.value),
                  })
                }
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                placeholder="Number of Years"
                min="1"
              />
            </>
          )}
        </div>
        <button
          onClick={handleAddInvestment}
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white"
        >
          <FiPlus className="mr-2" />
          Add Investment
        </button>
      </div>

      {/* Investment List */}
      <div className="space-y-4">
        {data.map((investment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-800 p-4 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={investment.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                placeholder="Investment Name"
              />
              <select
                value={investment.investment_type}
                onChange={(e) =>
                  handleChange(index, "investment_type", e.target.value)
                }
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                {investmentTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                    className="bg-zinc-800 text-white"
                  >
                    {type
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={investment.amount_invested}
                onChange={(e) =>
                  handleChange(index, "amount_invested", Number(e.target.value))
                }
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                placeholder="Amount Invested"
              />
              <input
                type="number"
                value={investment.current_value}
                onChange={(e) =>
                  handleChange(index, "current_value", Number(e.target.value))
                }
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                placeholder="Current Value"
              />
              <input
                type="date"
                value={investment.date_invested}
                onChange={(e) =>
                  handleChange(index, "date_invested", e.target.value)
                }
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
              {["sip", "fd"].includes(investment.investment_type) && (
                <>
                  <input
                    type="number"
                    value={investment.interest_rate}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "interest_rate",
                        Number(e.target.value)
                      )
                    }
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                    placeholder="Interest Rate (%)"
                    min="0.01"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={investment.years}
                    onChange={(e) =>
                      handleChange(index, "years", Number(e.target.value))
                    }
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
                    placeholder="Number of Years"
                    min="1"
                  />
                </>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleRemoveInvestment(index)}
                className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <FiTrash2 />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
      >
        Save
      </button>
    </motion.div>
  );
}

export default InvestmentDetails;
