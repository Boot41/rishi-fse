import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models import FinancialProfile
from .test_utils import create_test_user

@pytest.fixture
def auth_user(db):
    return create_test_user()

@pytest.fixture
def auth_client(auth_user):
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {auth_user["access_token"]}')
    return client

@pytest.mark.django_db
def test_get_financial_profile(auth_client, auth_user):
    profile = FinancialProfile.objects.create(
        user=auth_user['user'], 
        age=30, 
        risk_tolerance="medium", 
        monthly_salary=50000,
        monthly_savings=10000
    )
    
    url = reverse("financial-profile", args=[profile.id])
    response = auth_client.get(url)
    
    assert response.status_code == status.HTTP_200_OK
    assert response.data["age"] == 30
    assert response.data["risk_tolerance"] == "medium"
    assert response.data["monthly_salary"] == 50000
    assert response.data["monthly_savings"] == 10000

@pytest.mark.django_db
def test_create_financial_profile(auth_client, auth_user):
    url = reverse("financial-profile-create")
    data = {
        "user": auth_user['user'].id, 
        "age": 25, 
        "risk_tolerance": "high", 
        "monthly_salary": 50000,
        "monthly_savings": 15000
    }
    response = auth_client.post(url, data, format="json")
    
    assert response.status_code == status.HTTP_201_CREATED
    assert FinancialProfile.objects.filter(user=auth_user['user']).exists()

@pytest.mark.django_db
def test_update_financial_profile(auth_client, auth_user):
    profile = FinancialProfile.objects.create(
        user=auth_user['user'], 
        age=30, 
        risk_tolerance="medium", 
        monthly_salary=50000,
        monthly_savings=10000
    )   
    
    url = reverse("financial-profile", args=[profile.id])
    data = {
        "user": auth_user['user'].id, 
        "age": 35, 
        "risk_tolerance": "low", 
        "monthly_salary": 60000,
        "monthly_savings": 20000
    }
    response = auth_client.put(url, data, format="json")
    
    assert response.status_code == status.HTTP_200_OK
    profile.refresh_from_db()
    assert profile.age == 35
    assert profile.risk_tolerance == "low"
    assert profile.monthly_salary == 60000
    assert profile.monthly_savings == 20000

@pytest.mark.django_db
def test_delete_financial_profile(auth_client, auth_user):
    profile = FinancialProfile.objects.create(
        user=auth_user['user'], 
        age=30, 
        risk_tolerance="medium", 
        monthly_salary=50000,
        monthly_savings=10000
    )
    
    url = reverse("financial-profile", args=[profile.id])
    response = auth_client.delete(url)
    
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not FinancialProfile.objects.filter(id=profile.id).exists()

@pytest.mark.django_db
def test_unauthorized_access(client):
    user = User.objects.create_user(username="testuser", password="testpass")
    profile = FinancialProfile.objects.create(
        user=user, 
        age=30, 
        risk_tolerance="medium", 
        monthly_salary=50000,
        monthly_savings=10000
    )
    
    url = reverse("financial-profile", args=[profile.id])
    response = client.get(url)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
