from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    FinancialProfileCreateView, FinancialProfileView,
    IncomeListCreateView, IncomeDetailView,
    ExpenseListCreateView, ExpenseDetailView,
    InvestmentListCreateView, InvestmentDetailView,
    UserListCreateView, UserDetailView,
    RegisterView, LoginView
)
from .views.ai_views import ai_recommendations_view, ai_chat_view

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("profile/create/", FinancialProfileCreateView.as_view(), name="financial-profile-create"),
    path('profile/<int:pk>/', FinancialProfileView.as_view(), name='financial-profile'),
    
    path('income/', IncomeListCreateView.as_view(), name='income-list'),
    path('income/<int:pk>/', IncomeDetailView.as_view(), name='income-detail'),

    path('expense/', ExpenseListCreateView.as_view(), name='expense-list'),
    path('expense/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),

    path('investment/', InvestmentListCreateView.as_view(), name='investment-list'),
    path('investment/<int:pk>/', InvestmentDetailView.as_view(), name='investment-detail'),

    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # AI Advisor endpoints
    path('ai/insights/', ai_recommendations_view, name='ai-insights'),
    path('ai/chat/', ai_chat_view, name='ai-chat'),
]
