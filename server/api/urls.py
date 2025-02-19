from django.urls import path
from .views import (
    FinancialProfileView,
    IncomeListCreateView, IncomeDetailView,
    ExpenseListCreateView, ExpenseDetailView,
    InvestmentListCreateView, InvestmentDetailView
)

urlpatterns = [
    path('profile/<int:pk>/', FinancialProfileView.as_view(), name='financial-profile'),
    
    path('income/', IncomeListCreateView.as_view(), name='income-list'),
    path('income/<int:pk>/', IncomeDetailView.as_view(), name='income-detail'),

    path('expense/', ExpenseListCreateView.as_view(), name='expense-list'),
    path('expense/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),

    path('investment/', InvestmentListCreateView.as_view(), name='investment-list'),
    path('investment/<int:pk>/', InvestmentDetailView.as_view(), name='investment-detail'),
]
