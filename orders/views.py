from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from tariffs.models import Tariff
from .serializers import OrderSerializer, OrderCreateSerializer
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
def create_order(request):
    """
    Создать новый заказ
    """
    try:
        # Валидация входных данных
        create_serializer = OrderCreateSerializer(data=request.data)
        if not create_serializer.is_valid():
            return Response(
                {'error': 'Неверные данные', 'details': create_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Получаем тариф
        tariff_id = create_serializer.validated_data['tariff_id']
        try:
            tariff = Tariff.objects.get(id=tariff_id, is_active=True)
        except Tariff.DoesNotExist:
            return Response(
                {'error': 'Тариф не найден или неактивен'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Создаем заказ
        order = Order.objects.create(
            tariff=tariff,
            amount=tariff.price,
            customer_name=create_serializer.validated_data['customer_name'],
            customer_email=create_serializer.validated_data['customer_email'],
            customer_phone=create_serializer.validated_data.get('customer_phone', ''),
            address=create_serializer.validated_data.get('address', ''),
            status='pending'
        )

        logger.info(f"Order created: {order.id} for customer: {order.customer_email}")

        # Сериализуем ответ
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        return Response(
            {'error': 'Ошибка при создании заказа'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
