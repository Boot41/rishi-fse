from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Add a unique email constraint on User
User._meta.get_field('email')._unique = True

# User Financial Profile
class FinancialProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="financial_profile",unique=True)
    age = models.PositiveIntegerField()
    monthly_salary = models.IntegerField()
    monthly_savings = models.IntegerField()
    risk_tolerance = models.CharField(max_length=10, choices=[("low", "Low"), ("medium", "Medium"), ("high", "High")])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.risk_tolerance}"

# Income Details
class Income(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="incomes")
    source = models.CharField(max_length=255)  # Salary, Freelancing, etc.
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date_received = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.source}: ₹{self.amount}"

# Expense Details
class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    category = models.CharField(max_length=255)  # Rent, Groceries, Transport, etc.
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date_spent = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.category}: ₹{self.amount}"

# Investment Details (Stocks, Mutual Funds, SIPs)
class Investment(models.Model):
    INVESTMENT_TYPE_CHOICES = [
        ("stocks", "Stocks"),
        ("sip", "SIP"),
        ("fd", "Fixed Deposit"),
        ("gold", "Gold"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="investments")
    name = models.CharField(max_length=100)
    investment_type = models.CharField(max_length=20, choices=INVESTMENT_TYPE_CHOICES)
    amount_invested = models.DecimalField(max_digits=12, decimal_places=2)
    current_value = models.DecimalField(max_digits=12, decimal_places=2)
    date_invested = models.DateField()
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    years = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.name}: ₹{self.amount_invested}"

# Chat History
class ChatHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    messages = models.JSONField(default=list)  # Stores the list of messages
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
