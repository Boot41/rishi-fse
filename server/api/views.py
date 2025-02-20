from rest_framework import generics
from .models import FinancialProfile, Income, Expense, Investment
from django.contrib.auth.models import User
from .serializers import FinancialProfileSerializer, IncomeSerializer, ExpenseSerializer, InvestmentSerializer, UserSerializer
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .services.ai_advisor import get_financial_advice

# Financial Profile API - Create a new profile
class FinancialProfileCreateView(generics.CreateAPIView):
    queryset = FinancialProfile.objects.all()
    serializer_class = FinancialProfileSerializer

# Financial Profile API - Retrieve, update, or delete a profile
class FinancialProfileView(generics.RetrieveUpdateDestroyAPIView):
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

@csrf_exempt
def ai_recommendations_view(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        advice = get_financial_advice(user.id)
        return JsonResponse({"user": user.username, "advice": advice}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)