import json
import requests
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from api.models import FinancialProfile, Income, Expense, Investment
import os


API_KEY = os.getenv("GROQ_API_KEY")

def get_user_financial_data(user_id):
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

    prompt = f"""
    You are an expert financial advisor specializing in the Indian market. Your task is to analyze a user's financial profile and provide **personalized** recommendations based on their income, expenses, and investments.

    ### **\U0001F4CC User Profile:**
    - **Age:** {profile.age}
    - **Risk Tolerance:** {profile.risk_tolerance}

    ### **\U0001F4B0 Income Sources:**
    {income_details if income_details else "No income details provided."}

    ### **\U0001F4B8 Expenses:**
    {expense_details if expense_details else "No expense details provided."}

    ### **\U0001F4C8 Investment Portfolio:**
    {investment_details if investment_details else "No investment details provided."}

    ### **\U0001F50D Analysis & Recommendations Needed:**
    1️⃣ **Budget Optimization:** Identify unnecessary expenses and suggest better budgeting strategies.
    2️⃣ **Investment Strategy:** Recommend asset allocation based on the user's risk tolerance, income, and market trends.
    3️⃣ **Savings & Wealth Growth:** Identify opportunities for savings and ways to grow wealth efficiently.
    4️⃣ **Risk Management:** Advise on potential financial risks and ways to mitigate them.
    5️⃣ **Market Insights:** Provide **specific** investment suggestions (e.g., Indian stocks, mutual funds, SIPs) that align with the user’s profile.
    6️⃣ **Past Mistakes:** If any patterns indicate **missed investment opportunities** or inefficient spending, highlight them.

    ⚡ **Ensure that your advice is actionable and tailored to the user's current financial situation.**
    🚀 **Focus on wealth-building strategies, tax-saving options, and long-term financial security.**
    """

    return prompt

def query_ai_for_advice(user_id):
    prompt = get_user_financial_data(user_id)
    api_url = "https://api.groq.com/v1/chat/completions"  # Replace with actual API endpoint
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4",  # Specify the AI model
        "messages": [{"role": "system", "content": "You are a financial advisor."},
                      {"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    response = requests.post(api_url, headers=headers, data=json.dumps(payload))
    return response.json()

def get_financial_advice(user_id):
    response = query_ai_for_advice(user_id)
    return response.get("choices", [{}])[0].get("message", {}).get("content", "No response from AI.")
