from django.urls import path
from .views import (
    FinancialProfileView,
    IncomeListCreateView, IncomeDetailView,
    ExpenseListCreateView, ExpenseDetailView,
    InvestmentListCreateView, InvestmentDetailView, UserListCreateView, UserDetailView, ai_recommendations_view
)

urlpatterns = [
    path('profile/<int:pk>/', FinancialProfileView.as_view(), name='financial-profile'),
    
    path('income/', IncomeListCreateView.as_view(), name='income-list'),
    path('income/<int:pk>/', IncomeDetailView.as_view(), name='income-detail'),

    path('expense/', ExpenseListCreateView.as_view(), name='expense-list'),
    path('expense/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),

    path('investment/', InvestmentListCreateView.as_view(), name='investment-list'),
    path('investment/<int:pk>/', InvestmentDetailView.as_view(), name='investment-detail'),

    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    path('ai-recommendations/<int:user_id>/', ai_recommendations_view, name='ai-recommendations'),
]
