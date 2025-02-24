import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from ..serializers import UserDashboardSerializer

logger = logging.getLogger(__name__)

class UserDashboardView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDashboardSerializer

    def get_object(self):
        try:
            return self.request.user
        except Exception as e:
            logger.error(f"Error retrieving user dashboard for user {self.request.user.id}: {str(e)}", exc_info=True)
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
