from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from ..services.ai_advisor import get_financial_advice

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_recommendations_view(request, user_id):
    try:
        advice = get_financial_advice(user_id)
        return Response({"advice": advice})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
