from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import MinValueValidator, EmailValidator
from datetime import date
from .models import FinancialProfile, Income, Expense, Investment

class FinancialProfileSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField(
        validators=[MinValueValidator(18, message="Age must be at least 18")]
    )
    risk_tolerance = serializers.ChoiceField(
        choices=["low", "medium", "high"],
        error_messages={
            'invalid_choice': 'Risk tolerance must be one of: low, medium, high'
        }
    )

    class Meta:
        model = FinancialProfile
        fields = ['id', 'age', 'monthly_salary', 'risk_tolerance', 'created_at']
        read_only_fields = ['id', 'created_at']
        
    def validate(self, data):
        if data.get('age', 0) > 100:
            raise serializers.ValidationError({"age": "Age cannot be greater than 100"})
        return data

class IncomeSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01, message="Amount must be greater than 0")]
    )
    date_received = serializers.DateField()

    class Meta:
        model = Income
        fields = ['id', 'source', 'amount', 'date_received']
        read_only_fields = ['id']

    def validate_date_received(self, value):
        if value > date.today():
            raise serializers.ValidationError("Date received cannot be in the future")
        return value

    def validate_source(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Source must be at least 3 characters long")
        return value.strip()

class ExpenseSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01, message="Amount must be greater than 0")]
    )
    date_spent = serializers.DateField()

    class Meta:
        model = Expense
        fields = ['id', 'category', 'amount', 'date_spent']
        read_only_fields = ['id']

    def validate_date_spent(self, value):
        if value > date.today():
            raise serializers.ValidationError("Date spent cannot be in the future")
        return value

    def validate_category(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Category must be at least 3 characters long")
        return value.strip()

class InvestmentSerializer(serializers.ModelSerializer):
    amount_invested = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01, message="Amount invested must be greater than 0")]
    )
    current_value = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0, message="Current value cannot be negative")]
    )
    interest_rate = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        required=False,
        allow_null=True,
        validators=[MinValueValidator(0, message="Interest rate cannot be negative")]
    )
    years = serializers.IntegerField(
        required=False,
        allow_null=True,
        validators=[MinValueValidator(1, message="Years must be at least 1")]
    )
    date_invested = serializers.DateField()

    class Meta:
        model = Investment
        fields = ['id', 'name', 'investment_type', 'amount_invested', 'current_value', 
                 'date_invested', 'interest_rate', 'years']
        read_only_fields = ['id']

    def validate_date_invested(self, value):
        if value > date.today():
            raise serializers.ValidationError("Date invested cannot be in the future")
        return value

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long")
        return value.strip()

    def validate(self, data):
        if data.get('investment_type') == 'sip':
            errors = {}
            if not data.get('years'):
                errors['years'] = "Years is required for SIP investments"
            if not data.get('interest_rate'):
                errors['interest_rate'] = "Interest rate is required for SIP investments"
            if errors:
                raise serializers.ValidationError(errors)
        return data

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[EmailValidator(message="Enter a valid email address")]
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'username': {'min_length': 3, 'max_length': 150},
            'first_name': {'required': True, 'min_length': 2},
            'last_name': {'required': True, 'min_length': 2},
        }

class UserDashboardSerializer(serializers.ModelSerializer):
    financial_profile = FinancialProfileSerializer(read_only=True)
    incomes = IncomeSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    investments = InvestmentSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'financial_profile', 'incomes', 'expenses', 'investments']
        read_only_fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(
        required=True,
        validators=[EmailValidator(message="Enter a valid email address")]
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True, 'min_length': 2},
            'last_name': {'required': True, 'min_length': 2},
            'username': {'min_length': 3, 'max_length': 150},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Validate username
        username = attrs.get('username', '').lower()
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})
        
        # Validate email
        email = attrs.get('email', '').lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
            
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        required=True,
        min_length=3,
        max_length=150,
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

class AIChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(
        required=True,
        min_length=1,
        help_text="The message to send to the AI advisor"
    )

class AIChatResponseSerializer(serializers.Serializer):
    response = serializers.CharField(help_text="AI advisor's response")
    status = serializers.CharField(help_text="Status of the request")

class AIInsightResponseSerializer(serializers.Serializer):
    advice = serializers.CharField(help_text="AI generated financial insights")