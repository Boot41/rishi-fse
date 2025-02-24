import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from decimal import Decimal
from datetime import date

class TestUserFinancialWorkflow:
    @pytest.mark.django_db
    def test_complete_user_workflow(self):
        """Test complete user journey from registration to financial management"""
        client = APIClient()
        
        # 1. Register new user
        register_data = {
            'username': 'testuser',
            'password': 'StrongPass123!',
            'password2': 'StrongPass123!',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
        response = client.post(reverse('register'), register_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'user' in response.data
        assert 'tokens' in response.data
        user_id = response.data['user']['id']
        access_token = response.data['tokens']['access']
        
        # Set token immediately after registration
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        # 3. Create Financial Profile
        profile_data = {
            'user': user_id,
            'age': 30,
            'risk_tolerance': 'medium',
            'monthly_salary': 50000,
            'monthly_savings': 10000
        }
        response = client.post(reverse('financial-profile-create'), profile_data)
        assert response.status_code == status.HTTP_201_CREATED
        
        # 4. Add Income
        income_data = {
            'user': user_id,
            'source': 'Salary',
            'amount': '5000.00',
            'date_received': date.today().isoformat()
        }
        response = client.post(reverse('income-list'), income_data)
        assert response.status_code == status.HTTP_201_CREATED
        
        # 5. Add Expense
        expense_data = {
            'user': user_id,
            'category': 'Rent',
            'amount': '1000.00',
            'date_spent': date.today().isoformat()
        }
        response = client.post(reverse('expense-list'), expense_data)
        assert response.status_code == status.HTTP_201_CREATED
        
        # 6. Add Investment
        investment_data = {
            'user': user_id,
            'name': 'Tech Stocks',
            'investment_type': 'stocks',
            'amount_invested': '2000.00',
            'current_value': '2100.00',
            'date_invested': date.today().isoformat()
        }
        response = client.post(reverse('investment-list'), investment_data)
        assert response.status_code == status.HTTP_201_CREATED
        
        # 7. Get AI Recommendations
        response = client.get(reverse('ai-insights'))
        assert response.status_code == status.HTTP_200_OK
        assert 'advice' in response.data

    @pytest.mark.django_db
    def test_error_recovery_workflow(self):
        """Test system behavior when errors occur in the workflow"""
        client = APIClient()
        
        # 1. Register with invalid data first, then correct
        invalid_register = {
            'username': 'test',  # too short
            'password': 'weak',
            'password2': 'weak',
            'email': 'invalid-email',
            'first_name': 'T',  # too short
            'last_name': 'U'    # too short
        }
        response = client.post(reverse('register'), invalid_register)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
        # Now register correctly
        valid_register = {
            'username': 'testuser',
            'password': 'StrongPass123!',
            'password2': 'StrongPass123!',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
        response = client.post(reverse('register'), valid_register)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'user' in response.data
        assert 'tokens' in response.data
        user_id = response.data['user']['id']
        access_token = response.data['tokens']['access']
        
        # Set token immediately after registration
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        # 3. Try to create invalid profile, then correct
        invalid_profile = {
            'user': user_id,
            'age': 17,  # too young
            'risk_tolerance': 'invalid'
        }
        response = client.post(reverse('financial-profile-create'), invalid_profile)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
        valid_profile = {
            'user': user_id,
            'age': 30,
            'risk_tolerance': 'medium',
            'monthly_salary': 50000,
            'monthly_savings': 10000
        }
        response = client.post(reverse('financial-profile-create'), valid_profile)
        assert response.status_code == status.HTTP_201_CREATED
        
        # 4. Try to add invalid income, then correct
        invalid_income = {
            'user': user_id,
            'source': '',  # empty source
            'amount': '-100.00',  # negative amount
            'date_received': 'invalid-date'
        }
        response = client.post(reverse('income-list'), invalid_income)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
        valid_income = {
            'user': user_id,
            'source': 'Salary',
            'amount': '5000.00',
            'date_received': date.today().isoformat()
        }
        response = client.post(reverse('income-list'), valid_income)
        assert response.status_code == status.HTTP_201_CREATED
