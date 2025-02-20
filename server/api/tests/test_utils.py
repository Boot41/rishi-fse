from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

def create_test_user(username="testuser", password="testpass123", email="test@example.com"):
    """Create a test user and return the user object and its tokens"""
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name="Test",
        last_name="User"
    )
    refresh = RefreshToken.for_user(user)
    return {
        'user': user,
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh)
    }
