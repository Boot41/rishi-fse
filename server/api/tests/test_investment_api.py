import pytest
from django.contrib.auth.models import User
from api.models import Investment
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import date

# Setup test user
@pytest.fixture
def create_user(db):
    return User.objects.create_user(username="testuser", password="password123")

# Setup test investment record
@pytest.fixture
def create_investment(create_user, db):
    return Investment.objects.create(
        user=create_user,
        name="Tesla Stock",
        investment_type="stocks",
        amount_invested=50000,
        current_value=60000,
        date_invested=date.today()
    )

# API client fixture
@pytest.fixture
def api_client():
    return APIClient()

# Test fetching all investment records
def test_get_investment_list(api_client, create_investment):
    url = reverse("investment-list")
    response = api_client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["name"] == "Tesla Stock"

# Test creating a new investment record
def test_create_investment(api_client, create_user):
    url = reverse("investment-list")
    data = {
        "user": create_user.id,
        "name": "Bitcoin",
        "investment_type": "stocks",
        "amount_invested": 30000,
        "current_value": 35000,
        "date_invested": str(date.today())
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == 201
    assert Investment.objects.count() == 1
    assert Investment.objects.last().name == "Bitcoin"

# Test fetching a single investment record
def test_get_investment_detail(api_client, create_investment):
    url = reverse("investment-detail", args=[create_investment.id])
    response = api_client.get(url)
    assert response.status_code == 200
    assert response.data["name"] == "Tesla Stock"

# Test updating an investment record
def test_update_investment(api_client, create_investment):
    url = reverse("investment-detail", args=[create_investment.id])
    updated_data = {
        "user": create_investment.user.id,
        "name": "Updated Tesla Stock",
        "investment_type": "stocks",
        "amount_invested": 55000,
        "current_value": 65000,
        "date_invested": str(create_investment.date_invested)
    }
    response = api_client.put(url, updated_data, format="json")
    assert response.status_code == 200

    create_investment.refresh_from_db()
    assert create_investment.name == "Updated Tesla Stock"
    assert create_investment.amount_invested == 55000

# Test deleting an investment record
def test_delete_investment(api_client, create_investment):
    url = reverse("investment-detail", args=[create_investment.id])
    response = api_client.delete(url)
    assert response.status_code == 204
    assert Investment.objects.count() == 0
