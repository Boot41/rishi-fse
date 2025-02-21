from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from ..services.ai_advisor import get_financial_advice
from ..serializers import (
    AIChatRequestSerializer,
    AIChatResponseSerializer,
    AIInsightResponseSerializer
)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_recommendations_view(request):
    """Get AI-generated financial insights."""
    try:
        user_id = request.user.id
        advice = get_financial_advice(user_id, mode="normal")
        
        serializer = AIInsightResponseSerializer(data={"advice": advice})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
    except serializers.ValidationError as e:
        return Response(
            {"error": e.detail},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_chat_view(request):
    """Chat with AI financial advisor."""
    try:
        # Validate request data
        request_serializer = AIChatRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        
        user_id = request.user.id
        user_message = request_serializer.validated_data['message']
        
        response = get_financial_advice(
            user_id=user_id,
            mode="chat",
            user_message=user_message
        )
        
        # Validate response data
        response_serializer = AIChatResponseSerializer(data={
            "response": response,
            "status": "success"
        })
        response_serializer.is_valid(raise_exception=True)
        return Response(response_serializer.data)
    except serializers.ValidationError as e:
        return Response(
            {"error": e.detail},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
