import logging
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from ..serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework import serializers

logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            response_data = {
                'status': 'success',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }

            logger.info(f"New user registered: {user.username} (ID: {user.id})")
            return Response(response_data, status=status.HTTP_201_CREATED)

        except serializers.ValidationError as e:
            logger.error(f"User registration failed: {e.detail}", exc_info=True)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"User registration failed: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Registration failed, please try again'},
                status=status.HTTP_400_BAD_REQUEST
            )

class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Get username (case-insensitive) and password
            username = serializer.validated_data['username'].lower()
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(username__iexact=username)
                user = authenticate(username=user.username, password=password)
            except User.DoesNotExist:
                user = None

            if user is not None:
                refresh = RefreshToken.for_user(user)
                response_data = {
                    'status': 'success',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }
                logger.info(f"User logged in: {user.username} (ID: {user.id})")
                return Response(response_data)
            else:
                logger.warning(f"Failed login attempt for username: {username}")
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        except Exception as e:
            logger.error(f"Login error: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Login failed, please try again'},
                status=status.HTTP_400_BAD_REQUEST
            )