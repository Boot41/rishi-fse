import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Step Components
import BasicProfile from "../components/onboarding/BasicProfile";
import IncomeDetails from "../components/onboarding/IncomeDetails";
import ExpenseDetails from "../components/onboarding/ExpenseDetails";
import InvestmentDetails from "../components/onboarding/InvestmentDetails";

const API_URL = "http://localhost:8000/api";

function FinancialOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { section } = useParams();
  const isEdit = location.state?.isEdit || false;
  const editData = location.state?.data;

  // Determine initial step based on section parameter in edit mode
  const getInitialStep = () => {
    if (!isEdit) return 1;
    switch (section) {
      case "profile":
        return 1;
      case "income":
        return 2;
      case "expenses":
        return 3;
      case "investments":
        return 4;
      default:
        return 1;
    }
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    if (isEdit) {
      const initialData = {
        financial_profile: {},
        income: [],
        expenses: [],
        investments: [],
      };

      switch (section) {
        case "profile":
          initialData.financial_profile = editData;
          break;
        case "income":
          initialData.income = editData;
          break;
        case "expenses":
          initialData.expenses = editData;
          break;
        case "investments":
          initialData.investments = editData;
          break;
      }

      return initialData;
    }

    return {
      financial_profile: {},
      income: [],
      expenses: [],
      investments: [],
    };
  });

  const updateFormData = (field, data) => {
    setFormData((prev) => ({ ...prev, [field]: data }));
  };

  const validateBasicProfile = (profile) => {
    const errors = {};
    if (!profile.age || profile.age < 18) {
      errors.age = "Age must be at least 18";
    }
    if (!profile.risk_tolerance) {
      errors.risk_tolerance = "Please select your risk tolerance";
    }
    if (!profile.monthly_salary || profile.monthly_salary <= 0) {
      errors.monthly_salary = "Monthly salary must be greater than 0";
    }
    return errors;
  };

  const validateIncome = (incomeList) => {
    const errors = {};
    if (!incomeList || incomeList.length === 0) {
      errors.general = "At least one income source is required";
    }
    return errors;
  };

  const validateExpenses = (expenseList) => {
    const errors = {};
    if (!expenseList || expenseList.length === 0) {
      errors.general = "At least one expense is required";
    }
    return errors;
  };

  const validateInvestments = (investmentList) => {
    const errors = {};
    // Investments are optional
    return errors;
  };

  const handleSubmitStep = async () => {
    setErrors({});
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      let validationErrors = {};
      let endpoint = "";
      let payload = {};
      let method = "POST";

      switch (currentStep) {
        case 1:
          validationErrors = validateBasicProfile(formData.financial_profile);
          endpoint = "/profile/create/";
          payload = formData.financial_profile;
          break;
        case 2:
          validationErrors = validateIncome(formData.income);
          endpoint = "/income/";
          payload = formData.income;
          break;
        case 3:
          validationErrors = validateExpenses(formData.expenses);
          endpoint = "/expense/";
          payload = formData.expenses;
          break;
        case 4:
          validationErrors = validateInvestments(formData.investments);
          endpoint = "/investment/";
          payload = formData.investments;
          break;
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (isEdit) {
        method = "PUT";
        switch (section) {
          case "profile":
            endpoint = `/profile/${editData.id}/`;
            break;
          case "income":
            endpoint = `/income/${editData.id}/`;
            break;
          case "expenses":
            endpoint = `/expense/${editData.id}/`;
            break;
          case "investments":
            endpoint = `/investment/${editData.id}/`;
            break;
        }
      }

      // Handle arrays of data for income, expenses, and investments
      if (currentStep > 1 && !isEdit) {
        // For new entries, send array of items in a single request
        const data = Array.isArray(payload) ? payload : [payload];
        
        // For investments, ensure optional fields are null when not required
        if (currentStep === 4) {
          data.forEach(item => {
            if (!["sip", "fd"].includes(item.investment_type)) {
              item.interest_rate = null;
              item.years = null;
            }
          });
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || data.error || "Failed to save data");
        }
      } else {
        // For profile or edit mode, send single request
        const response = await fetch(`${API_URL}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.detail || data.error || "Failed to save data"
          );
        }
      }

      if (isEdit) {
        navigate("/dashboard");
      } else if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isEdit ? "Edit Financial Information" : "Financial Onboarding"}
            </h1>
            <p className="text-zinc-400">
              Step {currentStep} of 4:{" "}
              {currentStep === 1
                ? "Basic Profile"
                : currentStep === 2
                ? "Income Details"
                : currentStep === 3
                ? "Expense Details"
                : "Investment Details"}
            </p>
          </div>

          {errors.submit && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-6">
              {errors.submit}
            </div>
          )}

          <div className="bg-zinc-900 rounded-xl p-6 mb-6">
            {currentStep === 1 && (
              <BasicProfile
                data={formData.financial_profile}
                onChange={(data) => updateFormData("financial_profile", data)}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <IncomeDetails
                data={formData.income}
                onChange={(data) => updateFormData("income", data)}
                errors={errors}
              />
            )}
            {currentStep === 3 && (
              <ExpenseDetails
                data={formData.expenses}
                onChange={(data) => updateFormData("expenses", data)}
                errors={errors}
              />
            )}
            {currentStep === 4 && (
              <InvestmentDetails
                data={formData.investments}
                onChange={(data) => updateFormData("investments", data)}
                errors={errors}
              />
            )}
          </div>

          <div className="flex justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
            ) : (
              <div></div>
            )}
            <button
              onClick={handleSubmitStep}
              disabled={isLoading}
              className={`flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                "Saving..."
              ) : currentStep === 4 || isEdit ? (
                "Finish"
              ) : (
                <>
                  Next
                  <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FinancialOnboarding;
