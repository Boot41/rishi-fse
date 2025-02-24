import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Investment
from ..serializers import InvestmentSerializer

logger = logging.getLogger(__name__)

class InvestmentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer

    def get_queryset(self):
        logger.info(f"InvestmentListCreateView: Fetching investments for user {self.request.user.id}")
        return Investment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        investment = serializer.save(user=self.request.user)
        logger.info(f"InvestmentListCreateView: Investment {investment.id} created by user {self.request.user.id}")

    def create(self, request, *args, **kwargs):
        logger.info(f"InvestmentListCreateView: Received investment creation request from user {request.user.id}")

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
                logger.warning(f"InvestmentListCreateView: Validation failed for user {request.user.id}, errors: {errors}")
                return Response(
                    {"error": "Validation failed for some items", "details": errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            instances = []
            for serializer in valid_data:
                self.perform_create(serializer)
                instances.append(serializer.instance)

            logger.info(f"InvestmentListCreateView: {len(instances)} investments created successfully for user {request.user.id}")
            return Response(InvestmentSerializer(instances, many=True).data, status=status.HTTP_201_CREATED)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        logger.info(f"InvestmentListCreateView: Investment created successfully for user {request.user.id}")
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class InvestmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer

    def get_queryset(self):
        logger.info(f"InvestmentDetailView: Fetching specific investment for user {self.request.user.id}")
        return Investment.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        logger.info(f"InvestmentDetailView: Update request for investment {kwargs.get('pk')} by user {request.user.id}")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        logger.info(f"InvestmentDetailView: Delete request for investment {kwargs.get('pk')} by user {request.user.id}")
        return super().destroy(request, *args, **kwargs)

    def handle_exception(self, exc):
        if isinstance(exc, Investment.DoesNotExist):
            logger.warning(f"InvestmentDetailView: User {self.request.user.id} attempted to access a non-existent investment {self.kwargs.get('pk')}")
            return Response(
                {"error": "Investment not found or does not belong to the user"},
                status=status.HTTP_404_NOT_FOUND
            )
        logger.error(f"InvestmentDetailView: Unexpected error for user {self.request.user.id}: {str(exc)}")
        return super().handle_exception(exc)
