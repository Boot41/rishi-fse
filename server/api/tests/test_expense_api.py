import pytest
from django.contrib.auth.models import User
from api.models import Expense
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import date
from .test_utils import create_test_user

# Setup test user with authentication
@pytest.fixture
def auth_user(db):
    return create_test_user()

# Setup test expense record
@pytest.fixture
def create_expense(auth_user, db):
    return Expense.objects.create(user=auth_user['user'], category="Rent", amount=15000, date_spent=date.today())

# API client fixture with authentication
@pytest.fixture
def auth_client(auth_user):
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {auth_user["access_token"]}')
    return client

# API client fixture without authentication
@pytest.fixture
def api_client():
    return APIClient()

# Test fetching all expense records
def test_get_expense_list(auth_client, create_expense):
    url = reverse("expense-list")
    response = auth_client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["category"] == "Rent"

# Test creating a new expense record
def test_create_expense(auth_client, auth_user):
    url = reverse("expense-list")
    data = {"user": auth_user['user'].id, "category": "Groceries", "amount": 5000, "date_spent": str(date.today())}
    response = auth_client.post(url, data, format="json")
    assert response.status_code == 201
    assert Expense.objects.count() == 1
    assert Expense.objects.last().category == "Groceries"

# Test fetching a single expense record
def test_get_expense_detail(auth_client, create_expense):
    url = reverse("expense-detail", args=[create_expense.id])
    response = auth_client.get(url)
    assert response.status_code == 200
    assert response.data["category"] == "Rent"

# Test updating an expense record
def test_update_expense(auth_client, create_expense):
    url = reverse("expense-detail", args=[create_expense.id])
    updated_data = {"user": create_expense.user.id, "category": "Updated Rent", "amount": 16000, "date_spent": str(create_expense.date_spent)}
    response = auth_client.put(url, updated_data, format="json")
    assert response.status_code == 200
    assert response.data["category"] == "Updated Rent"

# Test deleting an expense record
def test_delete_expense(auth_client, create_expense):
    url = reverse("expense-detail", args=[create_expense.id])
    response = auth_client.delete(url)
    assert response.status_code == 204
    assert not Expense.objects.filter(id=create_expense.id).exists()

# Test unauthorized access
def test_unauthorized_access(api_client, create_expense):
    url = reverse("expense-list")
    response = api_client.get(url)
    assert response.status_code == 401
