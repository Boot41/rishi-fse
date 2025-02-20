from rest_framework import generics
from .models import FinancialProfile, Income, Expense, Investment
from django.contrib.auth.models import User
from .serializers import FinancialProfileSerializer, IncomeSerializer, ExpenseSerializer, InvestmentSerializer, UserSerializer

# Financial Profile API
class FinancialProfileView(generics.RetrieveUpdateAPIView):
    queryset = FinancialProfile.objects.all()
    serializer_class = FinancialProfileSerializer

# Income API
class IncomeListCreateView(generics.ListCreateAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

class IncomeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

# Expense API
class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

# Investment API
class InvestmentListCreateView(generics.ListCreateAPIView):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer

class InvestmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer

# List all users or create a new user
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Retrieve, update, or delete a specific user
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
