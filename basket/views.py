from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import Basket, BasketItem
from tariffs.models import Tariff
from .serializers import (
    BasketSerializer, BasketItemSerializer,
    AddToBasketSerializer, UpdateBasketItemSerializer
)
import logging

logger = logging.getLogger(__name__)


def get_or_create_basket(request):
    """Получить или создать корзину для пользователя или сессии"""
    if request.user.is_authenticated:
        basket, created = Basket.objects.get_or_create(user=request.user)
    else:
        # Для анонимных пользователей используем session_key
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        basket, created = Basket.objects.get_or_create(session_key=session_key)
    return basket


@api_view(['GET'])
@permission_classes([AllowAny])
def basket_list(request):
    """Получить корзину пользователя"""
    try:
        basket = get_or_create_basket(request)
        serializer = BasketSerializer(basket)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching basket: {str(e)}")
        return Response(
            {'error': 'Ошибка при получении корзины'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_basket(request):
    """Добавить товар в корзину"""
    try:
        serializer = AddToBasketSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Неверные данные', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        tariff_id = serializer.validated_data['tariff_id']
        quantity = serializer.validated_data['quantity']
        months = serializer.validated_data['months']

        # Проверяем тариф
        try:
            tariff = Tariff.objects.get(id=tariff_id, is_active=True)
        except Tariff.DoesNotExist:
            return Response(
                {'error': 'Тариф не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Получаем корзину
        basket = get_or_create_basket(request)

        # Проверяем, есть ли уже этот тариф в корзине
        basket_item, created = BasketItem.objects.get_or_create(
            basket=basket,
            tariff=tariff,
            defaults={'quantity': quantity, 'months': months}
        )

        if not created:
            # Если товар уже есть, увеличиваем количество
            basket_item.quantity += quantity
            basket_item.save()

        logger.info(f"Added to basket: {tariff.name} x {quantity} ({months} months)")

        # Возвращаем обновленную корзину
        basket_serializer = BasketSerializer(basket)
        return Response(basket_serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error adding to basket: {str(e)}")
        return Response(
            {'error': 'Ошибка при добавлении в корзину'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def basket_item_detail(request, item_id):
    """Получить, обновить или удалить элемент корзины"""
    try:
        basket = get_or_create_basket(request)

        try:
            basket_item = BasketItem.objects.get(id=item_id, basket=basket)
        except BasketItem.DoesNotExist:
            return Response(
                {'error': 'Элемент корзины не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == 'GET':
            serializer = BasketItemSerializer(basket_item)
            return Response(serializer.data)

        elif request.method == 'PUT':
            serializer = UpdateBasketItemSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {'error': 'Неверные данные', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if 'quantity' in serializer.validated_data:
                basket_item.quantity = serializer.validated_data['quantity']
            if 'months' in serializer.validated_data:
                basket_item.months = serializer.validated_data['months']
            basket_item.save()

            logger.info(f"Updated basket item: {basket_item.id}")

            # Возвращаем обновленную корзину
            basket_serializer = BasketSerializer(basket)
            return Response(basket_serializer.data)

        elif request.method == 'DELETE':
            basket_item.delete()
            logger.info(f"Deleted basket item: {item_id}")

            # Возвращаем обновленную корзину
            basket_serializer = BasketSerializer(basket)
            return Response(basket_serializer.data)

    except Exception as e:
        logger.error(f"Error with basket item: {str(e)}")
        return Response(
            {'error': 'Ошибка при работе с элементом корзины'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([AllowAny])
def clear_basket(request):
    """Очистить корзину"""
    try:
        basket = get_or_create_basket(request)
        basket.items.all().delete()
        logger.info(f"Cleared basket: {basket.id}")

        basket_serializer = BasketSerializer(basket)
        return Response(basket_serializer.data)

    except Exception as e:
        logger.error(f"Error clearing basket: {str(e)}")
        return Response(
            {'error': 'Ошибка при очистке корзины'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
