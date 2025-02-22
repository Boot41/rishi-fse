from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from ..serializers import UserDashboardSerializer

class UserDashboardView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDashboardSerializer

    def get_object(self):
        return self.request.user
