import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from api.models import FinancialProfile, Income, Expense, Investment
from decimal import Decimal
from datetime import date, timedelta

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user(db):
    user = User.objects.create_user(
        username='testuser',
        password='testpassword123',
        email='test@example.com',
        first_name='Test',
        last_name='User'
    )
    return user

@pytest.fixture
def auth_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client

@pytest.fixture
def financial_profile(test_user):
    return FinancialProfile.objects.create(
        user=test_user,
        age=30,
        monthly_salary=5000,
        monthly_savings=1000,
        risk_tolerance='medium'
    )

@pytest.fixture
def income(test_user):
    return Income.objects.create(
        user=test_user,
        source='Salary',
        amount=Decimal('5000.00'),
        date_received=date.today() - timedelta(days=5)
    )

@pytest.fixture
def expense(test_user):
    return Expense.objects.create(
        user=test_user,
        category='Rent',
        amount=Decimal('1000.00'),
        date_spent=date.today() - timedelta(days=3)
    )

@pytest.fixture
def investment(test_user):
    return Investment.objects.create(
        user=test_user,
        name='Stock Investment',
        investment_type='stocks',
        amount_invested=Decimal('10000.00'),
        current_value=Decimal('11000.00'),
        date_invested=date.today() - timedelta(days=30)
    )

@pytest.mark.django_db
class TestDashboard:
    def test_get_dashboard_authenticated(self, auth_client, financial_profile, income, expense, investment):
        """Test getting dashboard data when authenticated"""
        url = reverse('user-dashboard')
        response = auth_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == 'testuser'
        assert response.data['email'] == 'test@example.com'
        
        # Check financial profile data
        assert response.data['financial_profile']['age'] == 30
        assert float(response.data['financial_profile']['monthly_salary']) == 5000.0
        assert response.data['financial_profile']['risk_tolerance'] == 'medium'
        
        # Check income data
        assert len(response.data['incomes']) == 1
        assert response.data['incomes'][0]['source'] == 'Salary'
        assert float(response.data['incomes'][0]['amount']) == 5000.00
        
        # Check expense data
        assert len(response.data['expenses']) == 1
        assert response.data['expenses'][0]['category'] == 'Rent'
        assert float(response.data['expenses'][0]['amount']) == 1000.00
        
        # Check investment data
        assert len(response.data['investments']) == 1
        assert response.data['investments'][0]['name'] == 'Stock Investment'
        assert response.data['investments'][0]['investment_type'] == 'stocks'
        assert float(response.data['investments'][0]['amount_invested']) == 10000.00
        assert float(response.data['investments'][0]['current_value']) == 11000.00

    def test_get_dashboard_unauthenticated(self, api_client):
        """Test getting dashboard data when not authenticated"""
        url = reverse('user-dashboard')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_dashboard_no_financial_profile(self, auth_client):
        """Test getting dashboard data when user has no financial profile"""
        url = reverse('user-dashboard')
        response = auth_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['financial_profile'] is None
        assert len(response.data['incomes']) == 0
        assert len(response.data['expenses']) == 0
        assert len(response.data['investments']) == 0

    def test_get_dashboard_with_multiple_records(self, auth_client, test_user, financial_profile):
        """Test getting dashboard data with multiple financial records"""
        # Create multiple incomes
        Income.objects.create(
            user=test_user,
            source='Salary',
            amount=Decimal('5000.00'),
            date_received=date.today() - timedelta(days=5)
        )
        Income.objects.create(
            user=test_user,
            source='Bonus',
            amount=Decimal('1000.00'),
            date_received=date.today() - timedelta(days=2)
        )
        
        # Create multiple expenses
        Expense.objects.create(
            user=test_user,
            category='Rent',
            amount=Decimal('1000.00'),
            date_spent=date.today() - timedelta(days=3)
        )
        Expense.objects.create(
            user=test_user,
            category='Groceries',
            amount=Decimal('200.00'),
            date_spent=date.today() - timedelta(days=1)
        )
        
        # Create multiple investments
        Investment.objects.create(
            user=test_user,
            name='Stock Investment',
            investment_type='stocks',
            amount_invested=Decimal('10000.00'),
            current_value=Decimal('11000.00'),
            date_invested=date.today() - timedelta(days=30)
        )
        Investment.objects.create(
            user=test_user,
            name='Bond Investment',
            investment_type='bonds',
            amount_invested=Decimal('5000.00'),
            current_value=Decimal('5200.00'),
            date_invested=date.today() - timedelta(days=20)
        )
        
        url = reverse('user-dashboard')
        response = auth_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['incomes']) == 2
        assert len(response.data['expenses']) == 2
        assert len(response.data['investments']) == 2
