from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Регистрация нового пользователя
    Поля: username, email, password, password_confirm, first_name, last_name, phone, address, city
    """
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Ошибка валидации', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()

        # Создаем токен для пользователя
        token, created = Token.objects.get_or_create(user=user)

        logger.info(f"New user registered: {user.username} ({user.email})")

        return Response({
            'message': 'Пользователь успешно зарегистрирован',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'token': token.key
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error during registration: {str(e)}")
        return Response(
            {'error': 'Ошибка при регистрации'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Авторизация пользователя
    Поля: username, password
    """
    try:
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Неверные данные', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Неверный логин или пароль'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Получаем или создаем токен
        token, created = Token.objects.get_or_create(user=user)

        logger.info(f"User logged in: {user.username}")

        return Response({
            'message': 'Успешная авторизация',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'token': token.key
        })

    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return Response(
            {'error': 'Ошибка при авторизации'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Выход из системы"""
    try:
        # Удаляем токен пользователя
        request.user.auth_token.delete()
        logger.info(f"User logged out: {request.user.username}")

        return Response({'message': 'Успешный выход из системы'})

    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        return Response(
            {'error': 'Ошибка при выходе'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Получить профиль текущего пользователя"""
    try:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    except Exception as e:
        logger.error(f"Error fetching user profile: {str(e)}")
        return Response(
            {'error': 'Ошибка при получении профиля'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
