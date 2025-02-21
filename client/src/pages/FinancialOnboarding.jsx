import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Step Components
import BasicProfile from "../components/onboarding/BasicProfile";
import IncomeDetails from "../components/onboarding/IncomeDetails";
import ExpenseDetails from "../components/onboarding/ExpenseDetails";
import InvestmentDetails from "../components/onboarding/InvestmentDetails";

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
  const [formData, setFormData] = useState(() => {
    if (isEdit) {
      // Initialize with edit data if in edit mode
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

    // Default initial state for new onboarding
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
      return errors;
    }
    return errors;
  };

  const validateExpenses = (expenseList) => {
    const errors = {};
    if (!expenseList || expenseList.length === 0) {
      errors.general = "At least one expense is required";
      return errors;
    }
    return errors;
  };

  const validateInvestments = (investments) => {
    // Investments can be empty
    return {};
  };

  const handleNext = () => {
    let currentErrors = {};

    // Validate current step
    switch (currentStep) {
      case 1:
        currentErrors = validateBasicProfile(formData.financial_profile);
        break;
      case 2:
        currentErrors = validateIncome(formData.income);
        break;
      case 3:
        currentErrors = validateExpenses(formData.expenses);
        break;
      case 4:
        currentErrors = validateInvestments(formData.investments);
        break;
    }

    // If there are validation errors, display them and don't proceed
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    // Clear any existing errors
    setErrors({});

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Store the data in localStorage
      const existingData = JSON.parse(
        localStorage.getItem("financialData") || "{}"
      );
      let updatedData = { ...existingData };

      if (isEdit) {
        // Update only the edited section
        switch (section) {
          case "profile":
            updatedData.financial_profile = formData.financial_profile;
            break;
          case "income":
            updatedData.income = formData.income;
            break;
          case "expenses":
            updatedData.expenses = formData.expenses;
            break;
          case "investments":
            updatedData.investments = formData.investments;
            break;
        }
      } else {
        // Save all data for new onboarding
        updatedData = formData;
      }

      localStorage.setItem("financialData", JSON.stringify(updatedData));
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({}); // Clear errors when going back
    } else if (isEdit) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 p-8 rounded-xl shadow-xl w-full max-w-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-1/4 h-2 rounded-full mx-1 ${
                  step <= currentStep ? "bg-blue-500" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
          <div className="text-center text-zinc-400">
            {isEdit ? "Edit Mode - " : ""}Step {currentStep} of 4
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <BasicProfile
              data={formData.financial_profile}
              updateData={(data) => updateFormData("financial_profile", data)}
              isEdit={isEdit}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <IncomeDetails
              data={formData.income}
              updateData={(data) => updateFormData("income", data)}
              isEdit={isEdit}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <ExpenseDetails
              data={formData.expenses}
              updateData={(data) => updateFormData("expenses", data)}
              isEdit={isEdit}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <InvestmentDetails
              data={formData.investments}
              updateData={(data) => updateFormData("investments", data)}
              isEdit={isEdit}
              errors={errors}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            {currentStep === 1 && isEdit ? "Cancel" : "Back"}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {currentStep === 4 ? "Save" : "Next"}
            {currentStep < 4 && <FiArrowRight className="ml-2" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default FinancialOnboarding;
