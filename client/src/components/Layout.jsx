import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Finance Tracker</h1>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-3 hover:bg-blue-700 transition-colors ${isActive('/dashboard')}`}
              >
                <span className="material-icons mr-3">dashboard</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/income"
                className={`flex items-center px-4 py-3 hover:bg-blue-700 transition-colors ${isActive('/income')}`}
              >
                <span className="material-icons mr-3">attach_money</span>
                Income
              </Link>
            </li>
            <li>
              <Link
                to="/expenses"
                className={`flex items-center px-4 py-3 hover:bg-blue-700 transition-colors ${isActive('/expenses')}`}
              >
                <span className="material-icons mr-3">money_off</span>
                Expenses
              </Link>
            </li>
            <li>
              <Link
                to="/investments"
                className={`flex items-center px-4 py-3 hover:bg-blue-700 transition-colors ${isActive('/investments')}`}
              >
                <span className="material-icons mr-3">show_chart</span>
                Investments
              </Link>
            </li>
            <li>
              <Link
                to="/loan-analysis"
                className={`flex items-center px-4 py-3 hover:bg-blue-700 transition-colors ${isActive('/loan-analysis')}`}
              >
                <span className="material-icons mr-3">account_balance</span>
                Loan Analysis
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`flex items-center px-4 py-3 hover:bg-blue-700 transition-colors ${isActive('/profile')}`}
              >
                <span className="material-icons mr-3">person</span>
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 hover:bg-blue-700 transition-colors w-full text-left"
              >
                <span className="material-icons mr-3">logout</span>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
