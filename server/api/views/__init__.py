from .auth_views import RegisterView, LoginView
from .financial_profile_views import (
    FinancialProfileCreateView, 
    FinancialProfileView,
    UserFinancialProfileView
)
from .income_views import IncomeListCreateView, IncomeDetailView
from .expense_views import ExpenseListCreateView, ExpenseDetailView
from .investment_views import InvestmentListCreateView, InvestmentDetailView
from .user_views import UserListCreateView, UserDetailView
from .dashboard_views import UserDashboardView

__all__ = [
    'RegisterView',
    'LoginView',
    'FinancialProfileCreateView',
    'FinancialProfileView',
    'UserFinancialProfileView',
    'IncomeListCreateView',
    'IncomeDetailView',
    'ExpenseListCreateView',
    'ExpenseDetailView',
    'InvestmentListCreateView',
    'InvestmentDetailView',
    'UserListCreateView',
    'UserDetailView',
    'UserDashboardView',
]
