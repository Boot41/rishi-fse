from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import FinancialProfile
from ..serializers import FinancialProfileSerializer

class FinancialProfileCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FinancialProfile.objects.all()
    serializer_class = FinancialProfileSerializer

class FinancialProfileView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FinancialProfile.objects.all()
    serializer_class = FinancialProfileSerializer
