import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function BasicProfile({ data, updateData, errors }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEditing = location.state?.isEditing;
  
  useEffect(() => {
    // If we're in edit mode, initialize with existing data
    if (isEditing && location.state?.profile) {
      updateData(location.state.profile);
    }
  }, [isEditing, location.state?.profile, updateData]);

  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: field === 'monthly_salary' ? Number(value) : value
    });
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {isEditing ? 'Edit Profile' : 'Basic Profile'}
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
      
      <div className="bg-zinc-800 p-4 rounded-lg mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={data.age || ''}
              onChange={(e) => handleChange('age', e.target.value)}
              min="18"
              max="100"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
              placeholder="Enter your age"
            />
            {errors?.age && (
              <p className="mt-1 text-sm text-red-500">{errors.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Risk Tolerance
            </label>
            <select
              name="risk_tolerance"
              value={data.risk_tolerance || ''}
              onChange={(e) => handleChange('risk_tolerance', e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="" className="bg-zinc-800 text-white">Select risk tolerance</option>
              <option value="low" className="bg-zinc-800 text-white">Low</option>
              <option value="medium" className="bg-zinc-800 text-white">Medium</option>
              <option value="high" className="bg-zinc-800 text-white">High</option>
            </select>
            {errors?.risk_tolerance && (
              <p className="mt-1 text-sm text-red-500">{errors.risk_tolerance}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Monthly Salary
            </label>
            <input
              type="number"
              name="monthly_salary"
              value={data.monthly_salary || ''}
              onChange={(e) => handleChange('monthly_salary', e.target.value)}
              min="0"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
              placeholder="Enter your monthly salary"
            />
            {errors?.monthly_salary && (
              <p className="mt-1 text-sm text-red-500">{errors.monthly_salary}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BasicProfile;
