import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from unittest.mock import patch
from rest_framework import status

@pytest.mark.django_db
@patch("api.views.get_financial_advice")  # Mock the AI function
def test_ai_recommendations(mock_get_advice, client):
    user = User.objects.create_user(username="testuser", password="testpass")
    
    # Define mock response
    mock_get_advice.return_value = "Invest in index funds and reduce unnecessary expenses."
    
    url = reverse("ai-recommendations", args=[user.id])
    response = client.get(url)
    
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["user"] == "testuser"
    assert response.json()["advice"] == "Invest in index funds and reduce unnecessary expenses."
    
    # Ensure our mock was called once
    mock_get_advice.assert_called_once_with(user.id)
