from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import FinancialProfile
from ..serializers import FinancialProfileSerializer

class FinancialProfileCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FinancialProfile.objects.all()
    serializer_class = FinancialProfileSerializer

    def create(self, request, *args, **kwargs):
        # Check if user already has a profile
        if FinancialProfile.objects.filter(user=request.user).exists():
            return Response(
                {'error': 'You already have a financial profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FinancialProfileView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialProfileSerializer

    def get_queryset(self):
        return FinancialProfile.objects.filter(user=self.request.user)

    def get_object(self):
        # Get the user's profile or return 404
        return generics.get_object_or_404(FinancialProfile, user=self.request.user)
