import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IncomeManagement from "./pages/IncomeManagement";
import ExpenseManagement from "./pages/ExpenseManagement";
import InvestmentManagement from "./pages/InvestmentManagement";
import FinancialOnboarding from "./pages/FinancialOnboarding";
import AIChat from "./pages/AIChat";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  return children;
  //const isAuthenticated = localStorage.getItem("accessToken") !== null;
  //return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <FinancialOnboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/edit/:section"
          element={
            <ProtectedRoute>
              <FinancialOnboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/income" 
          element={
            <ProtectedRoute>
              <IncomeManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expense" 
          element={
            <ProtectedRoute>
              <ExpenseManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/investment" 
          element={
            <ProtectedRoute>
              <InvestmentManagement />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
