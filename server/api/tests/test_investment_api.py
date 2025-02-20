import pytest
from django.contrib.auth.models import User
from api.models import Investment
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import date
from .test_utils import create_test_user

# Setup test user with authentication
@pytest.fixture
def auth_user(db):
    return create_test_user()

# Setup test investment record
@pytest.fixture
def create_investment(auth_user, db):
    return Investment.objects.create(
        user=auth_user['user'],
        name="Test Stock",
        investment_type="stocks",
        amount_invested=10000,
        current_value=12000,
        date_invested=date.today()
    )

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

# Test fetching all investment records
def test_get_investment_list(auth_client, create_investment):
    url = reverse("investment-list")
    response = auth_client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["name"] == "Test Stock"

# Test creating a new investment record
def test_create_investment(auth_client, auth_user):
    url = reverse("investment-list")
    data = {
        "user": auth_user['user'].id,
        "name": "Test Mutual Fund",
        "investment_type": "mutual_funds",
        "amount_invested": 50000,
        "current_value": 52000,
        "date_invested": str(date.today())
    }
    response = auth_client.post(url, data, format="json")
    assert response.status_code == 201
    assert Investment.objects.count() == 1
    assert Investment.objects.last().name == "Test Mutual Fund"

# Test fetching a single investment record
def test_get_investment_detail(auth_client, create_investment):
    url = reverse("investment-detail", args=[create_investment.id])
    response = auth_client.get(url)
    assert response.status_code == 200
    assert response.data["name"] == "Test Stock"

# Test updating an investment record
def test_update_investment(auth_client, create_investment):
    url = reverse("investment-detail", args=[create_investment.id])
    updated_data = {
        "user": create_investment.user.id,
        "name": "Updated Stock",
        "investment_type": "stocks",
        "amount_invested": 15000,
        "current_value": 18000,
        "date_invested": str(create_investment.date_invested)
    }
    response = auth_client.put(url, updated_data, format="json")
    assert response.status_code == 200
    assert response.data["name"] == "Updated Stock"

# Test deleting an investment record
def test_delete_investment(auth_client, create_investment):
    url = reverse("investment-detail", args=[create_investment.id])
    response = auth_client.delete(url)
    assert response.status_code == 204
    assert not Investment.objects.filter(id=create_investment.id).exists()

# Test unauthorized access
def test_unauthorized_access(api_client, create_investment):
    url = reverse("investment-list")
    response = api_client.get(url)
    assert response.status_code == 401
