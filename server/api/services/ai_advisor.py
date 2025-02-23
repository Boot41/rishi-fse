import json
import requests
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from api.models import FinancialProfile, Income, Expense, Investment
import os

API_KEY = os.getenv("GROQ_API_KEY")

def get_user_financial_data(user_id):
    """Generate a detailed financial profile prompt based on user data."""
    user = get_object_or_404(User, id=user_id)
    profile = get_object_or_404(FinancialProfile, user=user)
    
    # Get income details
    incomes = Income.objects.filter(user=user)
    income_details = "\n".join([f"- {income.source}: ₹{income.amount} (received on {income.date_received})" for income in incomes])
    
    # Get expense details
    expenses = Expense.objects.filter(user=user)
    expense_details = "\n".join([f"- {expense.category}: ₹{expense.amount} (spent on {expense.date_spent})" for expense in expenses])
    
    # Get investment details
    investments = Investment.objects.filter(user=user)
    investment_details = "\n".join([f"- {inv.name} ({inv.investment_type}): ₹{inv.amount_invested}" for inv in investments])
    
    return f"""
    Financial Profile for {user.username}:
    Age: {profile.age}
    Monthly Salary: ₹{profile.monthly_salary}
    Risk Tolerance: {profile.risk_tolerance}
    
    Additional Income:
    {income_details if income_details else "No additional income details provided."}
    
    Monthly Expenses:
    {expense_details if expense_details else "No expense details provided."}
    
    Investments:
    {investment_details if investment_details else "No investment details provided."}
    """

def query_ai_for_advice(user_id, user_message=None, mode="normal", context=None):
    """Queries AI for financial advice. Supports normal mode, chat mode, and similar investments mode."""
    api_url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    if mode == "normal":
        # Generate financial insights
        financial_data = get_user_financial_data(user_id)
        messages = [
            {"role": "system", "content": "You are an expert financial advisor specializing in the Indian market. Analyze this user's financial profile and provide personalized recommendations. Format your response as 5 clear, numbered points that start with numbers (1., 2., etc)."},
            {"role": "user", "content": financial_data + "\n\nProvide 5 key insights and recommendations based on this financial profile."}
        ]
    
    elif mode == "chat":
        # Initialize chat with user's financial context
        financial_context = get_user_financial_data(user_id)
        messages = [
            {
                "role": "system", 
                "content": "You are a financial advisor. Use the following financial information about the user to provide personalized advice. " + financial_context
            }
        ]
        
        # Add context from frontend if provided
        if context:
            messages.extend(context)
            
        # Add current user message
        messages.append({"role": "user", "content": user_message})
    
    elif mode == "similar_investments":
        # Get user's investment details
        financial_data = get_user_financial_data(user_id)
        messages = [
            {
                "role": "system",
                "content": "You are an expert investment advisor specializing in the Indian market. Based on the user's current investment portfolio, suggest similar performing stocks and investments available in the market. Focus on investments with similar risk profiles, returns, and sectors. Format your response as a list of 5 investment suggestions, each containing the name, type, expected returns, and a brief rationale."
            },
            {
                "role": "user",
                "content": financial_data + "\n\nBased on my current investments, what are 5 similar performing stocks or investments I should consider?"
            }
        ]

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": 0.7
    }

    response = requests.post(api_url, headers=headers, data=json.dumps(payload))
    ai_response = response.json()

    # Extract AI response
    return ai_response.get("choices", [{}])[0].get("message", {}).get("content", "No response from AI.")

def get_financial_advice(user_id, mode="normal", user_message=None, context=None):
    """Handles financial insights (normal mode) or user chat (chat mode)."""
    return query_ai_for_advice(user_id, user_message, mode, context)
