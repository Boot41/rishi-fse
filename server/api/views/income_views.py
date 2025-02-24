import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Income
from ..serializers import IncomeSerializer

logger = logging.getLogger(__name__)

class IncomeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

    def get_queryset(self):
        logger.info(f"IncomeListCreateView: Fetching incomes for user {self.request.user.id}")
        return Income.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        income = serializer.save(user=self.request.user)
        logger.info(f"IncomeListCreateView: Income {income.id} created by user {self.request.user.id}")

    def create(self, request, *args, **kwargs):
        logger.info(f"IncomeListCreateView: Received income creation request from user {request.user.id}")

        if isinstance(request.data, list):
            serializers = [self.get_serializer(data=item) for item in request.data]
            errors = []
            valid_data = []

            for idx, serializer in enumerate(serializers):
                if serializer.is_valid():
                    valid_data.append(serializer)
                else:
                    errors.append({"index": idx, "errors": serializer.errors})

            if errors:
                logger.warning(f"IncomeListCreateView: Validation failed for user {request.user.id}, errors: {errors}")
                return Response(
                    {"error": "Validation failed for some items", "details": errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            instances = []
            for serializer in valid_data:
                self.perform_create(serializer)
                instances.append(serializer.instance)

            logger.info(f"IncomeListCreateView: {len(instances)} incomes created successfully for user {request.user.id}")
            return Response(IncomeSerializer(instances, many=True).data, status=status.HTTP_201_CREATED)

        return super().create(request, *args, **kwargs)


class IncomeDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

    def get_queryset(self):
        logger.info(f"IncomeDetailView: Fetching specific income for user {self.request.user.id}")
        return Income.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        logger.info(f"IncomeDetailView: Update request for income {kwargs.get('pk')} by user {request.user.id}")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        logger.info(f"IncomeDetailView: Delete request for income {kwargs.get('pk')} by user {request.user.id}")
        return super().destroy(request, *args, **kwargs)

    def handle_exception(self, exc):
        if isinstance(exc, Income.DoesNotExist):
            logger.warning(f"IncomeDetailView: User {self.request.user.id} attempted to access a non-existent income {self.kwargs.get('pk')}")
            return Response(
                {"error": "Income not found or does not belong to the user"},
                status=status.HTTP_404_NOT_FOUND
            )
        logger.error(f"IncomeDetailView: Unexpected error for user {self.request.user.id}: {str(exc)}")
        return super().handle_exception(exc)
