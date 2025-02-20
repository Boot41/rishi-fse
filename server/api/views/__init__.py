from .auth_views import RegisterView, LoginView
from .user_views import UserListCreateView, UserDetailView
from .financial_profile_views import FinancialProfileCreateView, FinancialProfileView
from .income_views import IncomeListCreateView, IncomeDetailView
from .expense_views import ExpenseListCreateView, ExpenseDetailView
from .investment_views import InvestmentListCreateView, InvestmentDetailView
from .ai_views import ai_recommendations_view

__all__ = [
    'RegisterView',
    'LoginView',
    'UserListCreateView',
    'UserDetailView',
    'FinancialProfileCreateView',
    'FinancialProfileView',
    'IncomeListCreateView',
    'IncomeDetailView',
    'ExpenseListCreateView',
    'ExpenseDetailView',
    'InvestmentListCreateView',
    'InvestmentDetailView',
    'ai_recommendations_view',
]
