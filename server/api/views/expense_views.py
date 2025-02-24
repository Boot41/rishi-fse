import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Expense
from ..serializers import ExpenseSerializer

logger = logging.getLogger(__name__)

class ExpenseListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        logger.info(f"ExpenseListCreateView: Fetching expenses for user {self.request.user.id}")
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        expense = serializer.save(user=self.request.user)
        logger.info(f"ExpenseListCreateView: Expense {expense.id} created by user {self.request.user.id}")

    def create(self, request, *args, **kwargs):
        logger.info(f"ExpenseListCreateView: Received expense creation request from user {request.user.id}")

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
                logger.warning(f"ExpenseListCreateView: Validation failed for user {request.user.id}, errors: {errors}")
                return Response(
                    {"error": "Validation failed for some items", "details": errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            instances = []
            for serializer in valid_data:
                self.perform_create(serializer)
                instances.append(serializer.instance)

            logger.info(f"ExpenseListCreateView: {len(instances)} expenses created successfully for user {request.user.id}")
            return Response(ExpenseSerializer(instances, many=True).data, status=status.HTTP_201_CREATED)

        return super().create(request, *args, **kwargs)


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        logger.info(f"ExpenseDetailView: Fetching specific expense for user {self.request.user.id}")
        return Expense.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        logger.info(f"ExpenseDetailView: Update request for expense {kwargs.get('pk')} by user {request.user.id}")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        logger.info(f"ExpenseDetailView: Delete request for expense {kwargs.get('pk')} by user {request.user.id}")
        return super().destroy(request, *args, **kwargs)

    def handle_exception(self, exc):
        if isinstance(exc, Expense.DoesNotExist):
            logger.warning(f"ExpenseDetailView: User {self.request.user.id} attempted to access a non-existent expense {self.kwargs.get('pk')}")
            return Response(
                {"error": "Expense not found or does not belong to the user"},
                status=status.HTTP_404_NOT_FOUND
            )
        logger.error(f"ExpenseDetailView: Unexpected error for user {self.request.user.id}: {str(exc)}")
        return super().handle_exception(exc)
