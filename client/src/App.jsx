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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/income" element={<IncomeManagement />} />
        <Route path="/expense" element={<ExpenseManagement />} />
        <Route path="/investment" element={<InvestmentManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
