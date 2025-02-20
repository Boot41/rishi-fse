import pytest
from django.contrib.auth.models import User
from api.models import Income
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import date

# Setup test user
@pytest.fixture
def create_user(db):
    return User.objects.create_user(username="testuser", password="password123")

# Setup test income record
@pytest.fixture
def create_income(create_user, db):
    return Income.objects.create(user=create_user, source="Salary", amount=50000, date_received=date.today())

# API client fixture
@pytest.fixture
def api_client():
    return APIClient()

# Test fetching all income records
def test_get_income_list(api_client, create_income):
    url = reverse("income-list")
    response = api_client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["source"] == "Salary"

# Test creating a new income record
def test_create_income(api_client, create_user):
    url = reverse("income-list")
    data = {"user": create_user.id, "source": "Freelancing", "amount": 20000, "date_received": str(date.today())}
    response = api_client.post(url, data, format="json")
    assert response.status_code == 201
    assert Income.objects.count() == 1
    assert Income.objects.last().source == "Freelancing"

# Test fetching a single income record
def test_get_income_detail(api_client, create_income):
    url = reverse("income-detail", args=[create_income.id])
    response = api_client.get(url)
    assert response.status_code == 200
    assert response.data["source"] == "Salary"

# Test updating an income record
def test_update_income(api_client, create_income):
    url = reverse("income-detail", args=[create_income.id])
    updated_data = {"user": create_income.user.id, "source": "Updated Salary", "amount": 55000, "date_received": str(create_income.date_received)}
    response = api_client.put(url, updated_data, format="json")
    assert response.status_code == 200

    create_income.refresh_from_db()
    assert create_income.source == "Updated Salary"
    assert create_income.amount == 55000

# Test deleting an income record
def test_delete_income(api_client, create_income):
    url = reverse("income-detail", args=[create_income.id])
    response = api_client.delete(url)
    assert response.status_code == 204
    assert Income.objects.count() == 0
