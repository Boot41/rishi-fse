import logging
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from ..services.ai_advisor import get_financial_advice
from ..serializers import (
    AIChatRequestSerializer,
    AIChatResponseSerializer,
    AIInsightResponseSerializer,
    AISimilarInvestmentsResponseSerializer
)
from ..models import FinancialProfile

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_recommendations_view(request):
    """Get AI-generated financial insights."""
    try:
        logger.info(f"User {request.user.id} requested AI recommendations.")
        
        # Check if user has a financial profile
        if not FinancialProfile.objects.filter(user=request.user).exists():
            logger.warning(f"User {request.user.id} has no financial profile.")
            return Response(
                {"error": "Please complete your financial profile first"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        advice = get_financial_advice(request.user.id, mode="normal")
        serializer = AIInsightResponseSerializer(data={"advice": advice})
        serializer.is_valid(raise_exception=True)
        
        logger.info(f"AI recommendations generated for user {request.user.id}.")
        return Response(serializer.data)
    except serializers.ValidationError as e:
        logger.error(f"Validation error: {e.detail}", exc_info=True)
        return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.critical(f"Unexpected error in ai_recommendations_view: {e}", exc_info=True)
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_chat_view(request):
    """Chat with AI financial advisor."""
    try:
        logger.info(f"User {request.user.id} initiated AI chat.")
        
        # Check if user has a financial profile
        if not FinancialProfile.objects.filter(user=request.user).exists():
            logger.warning(f"User {request.user.id} has no financial profile.")
            return Response(
                {"error": "Please complete your financial profile first"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate request data
        request_serializer = AIChatRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        
        response = get_financial_advice(
            user_id=request.user.id,
            mode="chat",
            user_message=request_serializer.validated_data['message']
        )
        
        # Validate response data
        response_serializer = AIChatResponseSerializer(data={"response": response, "status": "success"})
        response_serializer.is_valid(raise_exception=True)
        
        logger.info(f"AI chat response sent to user {request.user.id}.")
        return Response(response_serializer.data)
    except serializers.ValidationError as e:
        logger.error(f"Validation error: {e.detail}", exc_info=True)
        return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.critical(f"Unexpected error in ai_chat_view: {e}", exc_info=True)
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_similar_investments_view(request):
    """Get AI-generated similar investment recommendations."""
    try:
        logger.info(f"User {request.user.id} requested similar investments.")
        
        # Check if user has a financial profile
        if not FinancialProfile.objects.filter(user=request.user).exists():
            logger.warning(f"User {request.user.id} has no financial profile.")
            return Response(
                {"error": "Please complete your financial profile first"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recommendations = get_financial_advice(request.user.id, mode="similar_investments")
        serializer = AISimilarInvestmentsResponseSerializer(data={"recommendations": recommendations})
        serializer.is_valid(raise_exception=True)
        
        logger.info(f"Similar investment recommendations generated for user {request.user.id}.")
        return Response(serializer.data)
    except serializers.ValidationError as e:
        logger.error(f"Validation error: {e.detail}", exc_info=True)
        return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.critical(f"Unexpected error in ai_similar_investments_view: {e}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
