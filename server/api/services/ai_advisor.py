import json
import requests
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from api.models import FinancialProfile, Income, Expense, Investment
import os

API_KEY = os.getenv("GROQ_API_KEY")

# Store conversation history (can be improved with a database cache)
conversation_history = {}

def get_user_financial_data(user_id):
    """Generate a detailed financial profile prompt based on user data."""
    user = get_object_or_404(User, id=user_id)
    profile = FinancialProfile.objects.get(user=user)
    incomes = Income.objects.filter(user=user)
    expenses = Expense.objects.filter(user=user)
    investments = Investment.objects.filter(user=user)

    income_details = "\n".join([f"- {income.source}: ₹{income.amount}" for income in incomes])
    expense_details = "\n".join([f"- {expense.category}: ₹{expense.amount}" for expense in expenses])
    investment_details = "\n".join([
        f"- {inv.name} ({inv.investment_type}): Invested ₹{inv.amount_invested}, Current ₹{inv.current_value}"
        for inv in investments
    ])

    return f"""
    You are an expert financial advisor specializing in the Indian market. Analyze this user's financial profile and provide personalized recommendations.

    ### **📌 User Profile:**
    - **Age:** {profile.age}
    - **Risk Tolerance:** {profile.risk_tolerance}

    ### **💰 Income Sources:**
    {income_details if income_details else "No income details provided."}

    ### **💸 Expenses:**
    {expense_details if expense_details else "No expense details provided."}

    ### **📈 Investment Portfolio:**
    {investment_details if investment_details else "No investment details provided."}
    """

def query_ai_for_advice(user_id, user_message=None, mode="normal"):
    """Queries AI for financial advice. Supports normal mode and chat mode."""
    api_url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    if mode == "normal":
        # Generate financial insights
        prompt = get_user_financial_data(user_id) + "\n\n### **💡 Provide 5 key insights about this user's finances.**"
        messages = [{"role": "system", "content": "You are a financial advisor."},
                    {"role": "user", "content": prompt}]
    
    elif mode == "chat":
        # Maintain chat history
        if user_id not in conversation_history:
            conversation_history[user_id] = [
                {"role": "system", "content": "You are a financial advisor. Answer financial questions accurately."}
            ]
        
        # Append user's message to history
        conversation_history[user_id].append({"role": "user", "content": user_message})

        # Limit history length to prevent large payloads
        conversation_history[user_id] = conversation_history[user_id][-10:]

        messages = conversation_history[user_id]

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": 0.7
    }

    response = requests.post(api_url, headers=headers, data=json.dumps(payload))
    ai_response = response.json()

    # Extract AI response
    assistant_message = ai_response.get("choices", [{}])[0].get("message", {}).get("content", "No response from AI.")

    if mode == "chat":
        # Append AI response to conversation history
        conversation_history[user_id].append({"role": "assistant", "content": assistant_message})

    return assistant_message

def get_financial_advice(user_id, mode="normal", user_message=None):
    """Handles financial insights (normal mode) or user chat (chat mode)."""
    return query_ai_for_advice(user_id, user_message, mode)
