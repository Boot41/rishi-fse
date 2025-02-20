import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from api.models import FinancialProfile

@pytest.mark.django_db
def test_get_financial_profile(client):
    user = User.objects.create_user(username="testuser", password="testpass")
    profile = FinancialProfile.objects.create(user=user, age=30, risk_tolerance="medium")
    
    url = reverse("financial-profile", args=[profile.id])
    response = client.get(url)
    
    assert response.status_code == status.HTTP_200_OK
    assert response.data["age"] == 30
    assert response.data["risk_tolerance"] == "medium"

@pytest.mark.django_db
def test_create_financial_profile(client):
    user = User.objects.create_user(username="testuser", password="testpass")
    
    url = reverse("financial-profile-create")
    data = {"user": user.id, "age": 25, "risk_tolerance": "high"}
    response = client.post(url, data, content_type='application/json')
    
    assert response.status_code == status.HTTP_201_CREATED
    assert FinancialProfile.objects.filter(user=user).exists()

@pytest.mark.django_db
def test_update_financial_profile(client):
    user = User.objects.create_user(username="testuser", password="testpass")
    profile = FinancialProfile.objects.create(user=user, age=30, risk_tolerance="medium")   
    
    url = reverse("financial-profile", args=[profile.id])
    data = {"user" : user.id,"age": 35, "risk_tolerance": "low"}
    response = client.put(url, data, content_type='application/json')
    
    assert response.status_code == status.HTTP_200_OK
    profile.refresh_from_db()
    assert profile.age == 35
    assert profile.risk_tolerance == "low"

@pytest.mark.django_db
def test_delete_financial_profile(client):
    user = User.objects.create_user(username="testuser", password="testpass")
    profile = FinancialProfile.objects.create(user=user, age=30, risk_tolerance="medium")
    
    url = reverse("financial-profile", args=[profile.id])
    response = client.delete(url)
    
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not FinancialProfile.objects.filter(id=profile.id).exists()
