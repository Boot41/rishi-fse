import pytest
from django.contrib.auth.models import User
from api.models import Income
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import date
from .test_utils import create_test_user

# Setup test user with authentication
@pytest.fixture
def auth_user(db):
    return create_test_user()

# Setup test income record
@pytest.fixture
def create_income(auth_user, db):
    return Income.objects.create(
        user=auth_user['user'],
        source="Salary",
        amount=50000,
        date_received=date.today()
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

# Test fetching all income records
def test_get_income_list(auth_client, create_income):
    url = reverse("income-list")
    response = auth_client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["source"] == "Salary"

# Test creating a new income record
def test_create_income(auth_client, auth_user):
    url = reverse("income-list")
    data = {
        "user": auth_user['user'].id,
        "source": "Freelancing",
        "amount": 25000,
        "date_received": str(date.today())
    }
    response = auth_client.post(url, data, format="json")
    assert response.status_code == 201
    assert Income.objects.count() == 1
    assert Income.objects.last().source == "Freelancing"

# Test fetching a single income record
def test_get_income_detail(auth_client, create_income):
    url = reverse("income-detail", args=[create_income.id])
    response = auth_client.get(url)
    assert response.status_code == 200
    assert response.data["source"] == "Salary"

# Test updating an income record
def test_update_income(auth_client, create_income):
    url = reverse("income-detail", args=[create_income.id])
    updated_data = {
        "user": create_income.user.id,
        "source": "Updated Salary",
        "amount": 55000,
        "date_received": str(create_income.date_received)
    }
    response = auth_client.put(url, updated_data, format="json")
    assert response.status_code == 200
    assert response.data["source"] == "Updated Salary"

# Test deleting an income record
def test_delete_income(auth_client, create_income):
    url = reverse("income-detail", args=[create_income.id])
    response = auth_client.delete(url)
    assert response.status_code == 204
    assert not Income.objects.filter(id=create_income.id).exists()

# Test unauthorized access
def test_unauthorized_access(api_client, create_income):
    url = reverse("income-list")
    response = api_client.get(url)
    assert response.status_code == 401
