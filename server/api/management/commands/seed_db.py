from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import FinancialProfile, Income, Expense, Investment
from datetime import date
import random

class Command(BaseCommand):
    help = "Seed the database with dummy users and financial data"

    def handle(self, *args, **kwargs):
        # Define dummy users
        users_data = [
            {"username": "young_investor", "email": "young@example.com", "age": 25, "risk_tolerance": "high"},
            {"username": "mid_career", "email": "midcareer@example.com", "age": 40, "risk_tolerance": "medium"},
            {"username": "retired_saver", "email": "retired@example.com", "age": 60, "risk_tolerance": "low"},
        ]

        # Create Users & Financial Profiles
        users = []
        for user_data in users_data:
            user, _ = User.objects.get_or_create(username=user_data["username"], defaults={"email": user_data["email"]})
            users.append(user)
            FinancialProfile.objects.get_or_create(user=user, defaults={"age": user_data["age"], "risk_tolerance": user_data["risk_tolerance"]})

        # Add Incomes
        for user in users:
            Income.objects.get_or_create(user=user, source="Salary", amount=random.randint(50000, 150000), date_received=date.today())

        # Add Expenses
        expense_categories = ["Rent", "Groceries", "Transport", "Entertainment", "Healthcare"]
        for user in users:
            for category in expense_categories:
                Expense.objects.get_or_create(user=user, category=category, amount=random.randint(5000, 30000), date_spent=date.today())

        # Add Investments
        investments = [
            {"name": "Reliance Industries", "investment_type": "stocks", "amount_invested": 75000, "current_value": 80000},
            {"name": "SBI Bluechip Fund", "investment_type": "mutual_funds", "amount_invested": 50000, "current_value": 52000},
            {"name": "Gold ETF", "investment_type": "gold", "amount_invested": 40000, "current_value": 45000},
        ]
        for user in users:
            for inv in investments:
                Investment.objects.get_or_create(
                    user=user, name=inv["name"], investment_type=inv["investment_type"],
                    amount_invested=inv["amount_invested"], current_value=inv["current_value"],
                    date_invested=date.today()
                )

        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully!"))
