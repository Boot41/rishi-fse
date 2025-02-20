import pytest
from django.contrib.auth.models import User
from api.models import Expense
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import date

# Setup test user
@pytest.fixture
def create_user(db):
    return User.objects.create_user(username="testuser", password="password123")

# Setup test expense record
@pytest.fixture
def create_expense(create_user, db):
    return Expense.objects.create(user=create_user, category="Rent", amount=15000, date_spent=date.today())

# API client fixture
@pytest.fixture
def api_client():
    return APIClient()

# Test fetching all expense records
def test_get_expense_list(api_client, create_expense):
    url = reverse("expense-list")
    response = api_client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["category"] == "Rent"

# Test creating a new expense record
def test_create_expense(api_client, create_user):
    url = reverse("expense-list")
    data = {"user": create_user.id, "category": "Groceries", "amount": 5000, "date_spent": str(date.today())}
    response = api_client.post(url, data, format="json")
    assert response.status_code == 201
    assert Expense.objects.count() == 1
    assert Expense.objects.last().category == "Groceries"

# Test fetching a single expense record
def test_get_expense_detail(api_client, create_expense):
    url = reverse("expense-detail", args=[create_expense.id])
    response = api_client.get(url)
    assert response.status_code == 200
    assert response.data["category"] == "Rent"

# Test updating an expense record
def test_update_expense(api_client, create_expense):
    url = reverse("expense-detail", args=[create_expense.id])
    updated_data = {"user": create_expense.user.id, "category": "Updated Rent", "amount": 16000, "date_spent": str(create_expense.date_spent)}
    response = api_client.put(url, updated_data, format="json")
    assert response.status_code == 200

    create_expense.refresh_from_db()
    assert create_expense.category == "Updated Rent"
    assert create_expense.amount == 16000

# Test deleting an expense record
def test_delete_expense(api_client, create_expense):
    url = reverse("expense-detail", args=[create_expense.id])
    response = api_client.delete(url)
    assert response.status_code == 204
    assert Expense.objects.count() == 0
