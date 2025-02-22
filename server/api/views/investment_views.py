from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Investment
from ..serializers import InvestmentSerializer

class InvestmentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer

    def get_queryset(self):
        return Investment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Handle single item or array of items
        if isinstance(request.data, list):
            serializers = [
                self.get_serializer(data=item) for item in request.data
            ]
            for serializer in serializers:
                serializer.is_valid(raise_exception=True)
            
            instances = []
            for serializer in serializers:
                self.perform_create(serializer)
                instances.append(serializer.data)
            
            return Response(instances, status=status.HTTP_201_CREATED)
        else:
            return super().create(request, *args, **kwargs)

class InvestmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer

    def get_queryset(self):
        return Investment.objects.filter(user=self.request.user)
