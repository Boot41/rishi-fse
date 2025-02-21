import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from unittest.mock import patch, MagicMock
from rest_framework import status
from rest_framework.test import APIClient
from api.tests.test_utils import create_test_user
from decimal import Decimal
from datetime import date

pytestmark = pytest.mark.django_db

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
    return create_test_user()

@pytest.fixture
def auth_client(auth_user):
    client = APIClient()
    client.force_authenticate(user=auth_user['user'])
    client._credentials['user_id'] = auth_user['user'].id
    return client

class TestAIAdvice:
    @patch("api.services.ai_advisor.requests.post")
    @patch("api.services.ai_advisor.FinancialProfile.objects.get")
    @patch("api.services.ai_advisor.Income.objects.filter")
    @patch("api.services.ai_advisor.Expense.objects.filter")
    @patch("api.services.ai_advisor.Investment.objects.filter")
    def test_ai_insights(
        self, mock_investments, mock_expenses, mock_incomes, 
        mock_profile, mock_post, auth_client, mock_financial_data
    ):
        # Setup database mocks
        mock_profile.return_value = mock_financial_data['profile']
        mock_incomes.return_value = mock_financial_data['incomes']
        mock_expenses.return_value = mock_financial_data['expenses']
        mock_investments.return_value = mock_financial_data['investments']
        
        # Setup API response mock
        mock_post.return_value.json.return_value = {
            "choices": [{
                "message": {
                    "content": "Invest in index funds and reduce unnecessary expenses."
                }
            }]
        }
        
        url = reverse("ai-insights")
        response = auth_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert "advice" in response.json()
        assert response.json()["advice"] == "Invest in index funds and reduce unnecessary expenses."
        
        # Verify API call was made with correct data
        mock_post.assert_called_once()
        call_args = mock_post.call_args
        assert call_args[1]['headers']['Content-Type'] == 'application/json'
        assert 'messages' in call_args[1]['data']

    @patch("api.services.ai_advisor.requests.post")
    @patch("api.services.ai_advisor.FinancialProfile.objects.get")
    @patch("api.services.ai_advisor.Income.objects.filter")
    @patch("api.services.ai_advisor.Expense.objects.filter")
    @patch("api.services.ai_advisor.Investment.objects.filter")
    def test_ai_chat(
        self, mock_investments, mock_expenses, mock_incomes, 
        mock_profile, mock_post, auth_client, mock_financial_data
    ):
        # Setup database mocks
        mock_profile.return_value = mock_financial_data['profile']
        mock_incomes.return_value = mock_financial_data['incomes']
        mock_expenses.return_value = mock_financial_data['expenses']
        mock_investments.return_value = mock_financial_data['investments']
        
        # Setup API response mock
        mock_post.return_value.json.return_value = {
            "choices": [{
                "message": {
                    "content": "Based on your profile, I recommend increasing your emergency fund."
                }
            }]
        }
        
        url = reverse("ai-chat")
        data = {"message": "What should I do with my savings?"}
        response = auth_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert "response" in response.json()
        assert response.json()["response"] == "Based on your profile, I recommend increasing your emergency fund."
        assert response.json()["status"] == "success"
        
        # Verify API call was made with correct data
        mock_post.assert_called_once()
        call_args = mock_post.call_args
        assert call_args[1]['headers']['Content-Type'] == 'application/json'
        assert 'messages' in call_args[1]['data']

    def test_ai_chat_missing_message(self, auth_client):
        url = reverse("ai-chat")
        response = auth_client.post(url, {})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "error" in response.json()
        assert response.json()["error"] == {"message": ["This field is required."]}

    def test_unauthorized_access_insights(self, client):
        url = reverse("ai-insights")
        response = client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_unauthorized_access_chat(self, client):
        url = reverse("ai-chat")
        response = client.post(url, {"message": "Test message"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
