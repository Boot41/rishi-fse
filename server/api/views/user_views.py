import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from ..serializers import UserSerializer

logger = logging.getLogger(__name__)

class UserListCreateView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        logger.info(f"UserListCreateView: User {user.id} ({user.username}) requested user list")

        if not user.is_staff:
            logger.info(f"UserListCreateView: Restricted user list to only User {user.id}")
            return User.objects.filter(id=user.id)

        logger.info("UserListCreateView: Admin user accessed full user list")
        return User.objects.all()

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        user = self.request.user
        obj = super().get_object()

        if not user.is_staff and obj.id != user.id:
            logger.warning(f"UserDetailView: Unauthorized access attempt by User {user.id} to User {obj.id}")
            return Response({"error": "You don't have permission to access this user"}, status=status.HTTP_403_FORBIDDEN)

        logger.info(f"UserDetailView: User {user.id} accessed details of User {obj.id}")
        return obj
