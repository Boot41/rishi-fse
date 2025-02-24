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
        # Get user's financial profile and investment data
        financial_data = get_user_financial_data(user_id)
        investments = Investment.objects.filter(user=user_id)
        
        if not investments:
            prompt = f"""The user currently has no investments in their portfolio.

{financial_data}

Based on their financial profile, risk tolerance, and current financial situation, recommend 5 suitable investment options for them to start their investment journey.

Format your response as follows:

Recommended Investment Strategy:
[2-3 lines explaining the overall investment approach based on their risk tolerance and financial situation]

Investment Recommendations:

1. Investment Name (Type)
Expected returns and key benefits in a single line.

[Continue for all 5 recommendations]"""

            messages = [
                {"role": "system", "content": "You are a financial advisor specializing in creating starter investment portfolios. Focus on providing a balanced mix of investments suitable for beginners while considering their risk tolerance and financial situation."},
                {"role": "user", "content": prompt}
            ]
            
            return query_ai(messages)
        
        # Check if there are any stock investments
        stock_investments = [inv for inv in investments if inv.investment_type == 'stocks']
        has_stocks = len(stock_investments) > 0
        
        # Create investment list
        investment_list = "\n".join([
            f"- {inv.name} ({inv.investment_type}): ₹{inv.amount_invested}" +
            (f" [Stock Symbol]" if inv.investment_type == 'stocks' else "")
            for inv in investments
        ])
        
        # Create a dynamic intro based on current investments
        investment_names = [f"{inv.name} ({inv.investment_type})" for inv in investments]
        if len(investment_names) == 1:
            investment_summary = investment_names[0]
        elif len(investment_names) == 2:
            investment_summary = f"{investment_names[0]} and {investment_names[1]}"
        else:
            investment_summary = ", ".join(investment_names[:-1]) + f", and {investment_names[-1]}"
        
        # Create different prompts based on whether there are stocks
        if has_stocks:
            prompt = f"""Based on your current investments in {investment_summary}, I'll analyze your stock holdings and suggest similar investments.

Current Portfolio:
{investment_list}

{financial_data}

Instructions:
1. First, look up and analyze the beta values of the current stock investments in the portfolio
2. Then, recommend 5 investments that have similar risk profiles to these stocks
3. For any stock recommendations, include their beta values and how they compare to the current holdings
4. You may also suggest non-stock investments that have similar risk-return characteristics

Format your response exactly as follows:

Current Stock Analysis:
[Analyze the beta values of the stocks in the portfolio]

Based on this analysis, here are 5 similar investment opportunities:

1. Investment Name (Type)
Expected returns, beta value (if stock), and key benefits in a single line.

[Continue for all 5 recommendations]"""
        else:
            prompt = f"""Based on your current investments in {investment_summary}, I'll suggest similar investments that align with your risk tolerance and investment goals.

Current Portfolio:
{investment_list}

{financial_data}

Provide exactly 5 investment recommendations similar to their current portfolio. Format your response exactly as follows:

Based on your current portfolio, here are some similar investment opportunities:

1. Investment Name (Type)
Expected returns and key benefits in a single line.

[Continue for all 5 recommendations]"""

        messages = [
            {"role": "system", "content": "You are a financial advisor specializing in investment recommendations. " +
             ("You can analyze current market data to determine beta values for stocks and suggest similar investments." if has_stocks else "")},
            {"role": "user", "content": prompt}
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
