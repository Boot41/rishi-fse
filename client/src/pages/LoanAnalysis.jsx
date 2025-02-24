import { useState } from "react";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";

function LoanAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    loan_type: "",
    loan_amount: "",
    interest_rate: "",
    loan_tenure: "",
    existing_loan_emi: "0",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/ai/loan-analysis/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            loan_type: formData.loan_type,
            loan_amount: parseFloat(formData.loan_amount),
            interest_rate: parseFloat(formData.interest_rate),
            loan_tenure: parseInt(formData.loan_tenure),
            existing_loan_emi: parseFloat(formData.existing_loan_emi || 0),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get loan analysis");
      }

      const data = await response.json();
      setAnalysis(data.advice);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Loan Affordability Analysis
          </h1>
          <p className="text-gray-400">
            Get AI-powered insights on your loan affordability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loan Details Form */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">
              Enter Loan Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Loan Type
                </label>
                <select
                  name="loan_type"
                  value={formData.loan_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="">Select a loan type</option>
                  <option value="Home">Home Loan</option>
                  <option value="Car">Car Loan</option>
                  <option value="Personal">Personal Loan</option>
                  <option value="Education">Education Loan</option>
                  <option value="Business">Business Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  name="loan_amount"
                  value={formData.loan_amount}
                  onChange={handleInputChange}
                  required
                  min="1000"
                  placeholder="Enter loan amount"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Interest Rate (% per annum)
                </label>
                <input
                  type="number"
                  name="interest_rate"
                  value={formData.interest_rate}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="1"
                  max="30"
                  placeholder="Enter interest rate"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Loan Tenure (years)
                </label>
                <input
                  type="number"
                  name="loan_tenure"
                  value={formData.loan_tenure}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="30"
                  placeholder="Enter loan tenure"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Existing Loan EMIs (₹/month)
                </label>
                <input
                  type="number"
                  name="existing_loan_emi"
                  value={formData.existing_loan_emi}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter existing EMIs (if any)"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  "Analyze Loan Affordability"
                )}
              </button>
            </form>
          </div>

          {/* Analysis Results */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">
              AI Analysis Results
            </h2>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">
                  Analyzing your loan affordability...
                </div>
              </div>
            ) : analysis ? (
              <div className="text-gray-300 prose prose-invert max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p>
                  Fill in the loan details to get AI-powered affordability
                  analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanAnalysis;
