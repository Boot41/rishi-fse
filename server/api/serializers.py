from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FinancialProfile, Income, Expense, Investment

class FinancialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialProfile
        fields = '__all__'

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']