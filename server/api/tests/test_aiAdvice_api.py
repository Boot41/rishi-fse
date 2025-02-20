import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from unittest.mock import patch
from rest_framework import status
from rest_framework.test import APIClient
from api.tests.test_utils import create_test_user

pytestmark = pytest.mark.django_db

@pytest.fixture
def auth_user(db):
    return create_test_user()

@pytest.fixture
def auth_client(auth_user):
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {auth_user["access_token"]}')
    return client

class TestAIRecommendations:
    @patch("api.services.ai_advisor.get_financial_advice")
    def test_ai_recommendations(self, mock_get_advice, auth_client, auth_user):
        # Define mock response
        mock_get_advice.return_value = "Invest in index funds and reduce unnecessary expenses."
        
        url = reverse("ai-recommendations", args=[auth_user['user'].id])
        response = auth_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert "advice" in response.json()
        assert response.json()["advice"] == "Invest in index funds and reduce unnecessary expenses."
        
        # Ensure our mock was called once
        mock_get_advice.assert_called_once_with(auth_user['user'].id)

    def test_unauthorized_access(self, client):
        user = User.objects.create_user(username="testuser", password="testpass")
        url = reverse("ai-recommendations", args=[user.id])
        response = client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
