import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from unittest.mock import patch, MagicMock
from rest_framework import status
from rest_framework.test import APIClient
from api.tests.test_utils import create_test_user
from decimal import Decimal
from datetime import date
import os
from api.models import FinancialProfile

pytestmark = pytest.mark.django_db

@pytest.fixture(autouse=True)
def setup_env():
    os.environ["GROQ_API_KEY"] = "test-api-key"
    yield
    del os.environ["GROQ_API_KEY"]

@pytest.fixture
def mock_financial_data():
    return {
        'profile': MagicMock(age=30, risk_tolerance='medium'),
        'incomes': [
            MagicMock(source='Salary', amount=Decimal('50000'))
        ],
        'expenses': [
            MagicMock(category='Rent', amount=Decimal('15000'))
        ],
        'investments': [
            MagicMock(
                name='Stocks',
                investment_type='equity',
                amount_invested=Decimal('10000'),
                current_value=Decimal('12000')
            )
        ]
    }

@pytest.fixture
def auth_user(db):
    user_data = create_test_user()
    # Create financial profile for the user
    FinancialProfile.objects.create(
        user=user_data['user'],
        age=30,
        monthly_salary=50000,
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
    @patch("api.services.ai_advisor.query_ai_for_advice")
    def test_ai_insights(self, mock_query_ai, auth_client):
        # Setup API response mock
        mock_query_ai.return_value = "Invest in index funds and reduce unnecessary expenses."
        
        url = reverse("ai-insights")
        response = auth_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert "advice" in response.json()
        assert response.json()["advice"] == "Invest in index funds and reduce unnecessary expenses."
        
        # Verify API call was made with correct data
        mock_query_ai.assert_called_once_with(
            auth_client._credentials['user_id'],
            None,  # user_message
            "normal",  # mode
            None  # context
        )

    @patch("api.services.ai_advisor.query_ai_for_advice")
    def test_ai_chat(self, mock_query_ai, auth_client):
        # Setup API response mock
        expected_response = "Based on your profile, I recommend increasing your emergency fund."
        mock_query_ai.return_value = expected_response
        
        url = reverse("ai-chat")
        data = {"message": "What should I do with my savings?"}
        response = auth_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert "response" in response.json()
        assert response.json()["response"] == expected_response
        assert response.json()["status"] == "success"
        
        # Verify API call was made with correct data
        mock_query_ai.assert_called_once_with(
            auth_client._credentials['user_id'],
            "What should I do with my savings?",  # user_message
            "chat",  # mode
            None  # context
        )

    def test_ai_chat_missing_message(self, auth_client):
        url = reverse("ai-chat")
        data = {}  # Missing message field
        response = auth_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "message" in response.json()["error"]

    def test_ai_chat_empty_message(self, auth_client):
        url = reverse("ai-chat")
        data = {"message": ""}  # Empty message
        response = auth_client.post(url, data)
        
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
