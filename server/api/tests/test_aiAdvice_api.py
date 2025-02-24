import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from unittest.mock import patch, MagicMock
from rest_framework import status
from rest_framework.test import APIClient
from api.tests.test_utils import create_test_user
from decimal import Decimal
import os
from api.models import FinancialProfile

pytestmark = pytest.mark.django_db

@pytest.fixture(autouse=True)
def setup_env():
    os.environ["GROQ_API_KEY"] = "test-api-key"
    yield
    del os.environ["GROQ_API_KEY"]

@pytest.fixture
def auth_user(db):
    user_data = create_test_user()
    FinancialProfile.objects.create(
        user=user_data['user'],
        age=30,
        monthly_salary=50000,
        monthly_savings=10000,
        risk_tolerance='medium'
    )
    return user_data

@pytest.fixture
def auth_client(auth_user):
    client = APIClient()
    client.force_authenticate(user=auth_user['user'])
    client._credentials['user_id'] = auth_user['user'].id
    return client

class TestAIAdvice:
    def setup_method(self):
        self.patcher = patch("api.services.ai_advisor.get_financial_advice")
        self.mock_get_advice = self.patcher.start()

    def teardown_method(self):
        self.patcher.stop()

    def test_ai_insights(self, auth_client):
        self.mock_get_advice.reset_mock()
        self.mock_get_advice.return_value = "Invest in index funds and reduce unnecessary expenses."

        url = reverse("ai-insights")
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["advice"] == "Invest in index funds and reduce unnecessary expenses."

        self.mock_get_advice.assert_called_once_with(auth_client._credentials['user_id'], mode="normal")

    def test_ai_chat_missing_message(self, auth_client):
        url = reverse("ai-chat")
        response = auth_client.post(url, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "message" in response.json()["error"]

    def test_ai_chat_empty_message(self, auth_client):
        url = reverse("ai-chat")
        response = auth_client.post(url, {"message": ""})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "message" in response.json()["error"]

    def test_unauthorized_access_insights(self, client):
        url = reverse("ai-insights")
        response = client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_unauthorized_access_chat(self, client):
        url = reverse("ai-chat")
        response = client.post(url, {"message": "Test message"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_ai_similar_investments_no_profile(self, db):
        user_data = create_test_user()
        client = APIClient()
        client.force_authenticate(user=user_data['user'])

        url = reverse("ai-similar-investments")
        response = client.get(url)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "error" in response.json()
        assert response.json()["error"] == "Please complete your financial profile first"

        self.mock_get_advice.assert_not_called()
