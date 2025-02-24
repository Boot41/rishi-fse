import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import FinancialProfile
from ..serializers import FinancialProfileSerializer

logger = logging.getLogger(__name__)

class FinancialProfileCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FinancialProfile.objects.all()
    serializer_class = FinancialProfileSerializer

    def create(self, request, *args, **kwargs):
        logger.info(f"FinancialProfileCreateView: Received request from user {request.user.id}")

        if FinancialProfile.objects.filter(user=request.user).exists():
            logger.warning(f"User {request.user.id} attempted to create a duplicate financial profile.")
            return Response(
                {'error': 'You already have a financial profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            logger.info(f"FinancialProfileCreateView: Validation successful for user {request.user.id}")
            self.perform_create(serializer)
            logger.info(f"FinancialProfile created for user {request.user.id}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        logger.error(f"FinancialProfileCreateView: Validation failed for user {request.user.id}, errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FinancialProfileView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialProfileSerializer

    def get_queryset(self):
        return FinancialProfile.objects.filter(user=self.request.user)

    def get_object(self):
        logger.info(f"FinancialProfileView: Fetching financial profile for user {self.request.user.id}")
        return generics.get_object_or_404(FinancialProfile, user=self.request.user)

class UserFinancialProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialProfileSerializer

    def get_object(self):
        logger.info(f"UserFinancialProfileView: Fetching financial profile for user {self.request.user.id}")
        return FinancialProfile.objects.filter(user=self.request.user).first()
