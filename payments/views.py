from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from orders.models import Order
from .serializers import (
    PaymentSerializer, PaymentCreateSerializer,
    PaymentStatusSerializer, KaspiWebhookSerializer
)
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
def create_kaspi_payment(request):
    """
    Создать платеж через Kaspi
    """
    try:
        # Валидация входных данных
        create_serializer = PaymentCreateSerializer(data=request.data)
        if not create_serializer.is_valid():
            return Response(
                {'error': 'Неверные данные', 'details': create_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        order_id = create_serializer.validated_data['order_id']

        # Получаем заказ
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Заказ не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Проверяем, что заказ еще не оплачен
        if order.status == 'paid':
            return Response(
                {'error': 'Заказ уже оплачен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем, нет ли активного платежа для этого заказа
        existing_payment = Payment.objects.filter(
            order=order,
            status='pending'
        ).first()

        if existing_payment:
            serializer = PaymentSerializer(existing_payment)
            return Response(serializer.data)

        # Создаем платеж (заглушка для Kaspi API)
        payment = Payment.objects.create(
            order=order,
            amount=order.amount,
            payment_method='kaspi',
            status='pending',
            qr_data=f'KASPI_QR_{order.id}',
            payment_url=f'https://kaspi.kz/payment/test/{order.id}',
            kaspi_payment_id=f'kaspi_{order.id}'
        )

        logger.info(f"Kaspi payment created: {payment.id} for order: {order.id}")

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error creating Kaspi payment: {str(e)}")
        return Response(
            {'error': 'Ошибка при создании платежа'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def kaspi_webhook(request):
    """
    Webhook для получения статусов платежей от Kaspi
    """
    try:
        # Валидация данных webhook
        webhook_serializer = KaspiWebhookSerializer(data=request.data)
        if not webhook_serializer.is_valid():
            logger.warning(f"Invalid webhook data: {webhook_serializer.errors}")
            return Response(
                {'error': 'Неверные данные webhook', 'details': webhook_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_id = webhook_serializer.validated_data['paymentId']
        payment_status = webhook_serializer.validated_data['status']
        transaction_id = webhook_serializer.validated_data.get('transactionId', '')

        # Находим платеж
        try:
            payment = Payment.objects.get(kaspi_payment_id=payment_id)
        except Payment.DoesNotExist:
            logger.error(f"Payment not found: {payment_id}")
            return Response(
                {'error': 'Платеж не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Обновляем статус платежа
        payment.status = payment_status
        if transaction_id:
            payment.transaction_id = transaction_id
        payment.save()

        # Если платеж успешен, обновляем статус заказа
        if payment_status == 'completed':
            payment.order.status = 'paid'
            payment.order.save()
            logger.info(f"Payment completed: {payment.id}, Order: {payment.order.id}")
        elif payment_status == 'failed':
            payment.order.status = 'failed'
            payment.order.save()
            logger.warning(f"Payment failed: {payment.id}, Order: {payment.order.id}")

        return Response({'status': 'success'})

    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        return Response(
            {'error': 'Ошибка при обработке webhook'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def payment_status(request, payment_id):
    """
    Получение статуса платежа
    """
    try:
        payment = Payment.objects.get(id=payment_id)

        response_data = {
            'id': payment.id,
            'status': payment.status,
            'payment_method': payment.payment_method,
            'amount': float(payment.amount),
            'transaction_id': payment.transaction_id,
            'payment_url': payment.payment_url,
            'order_status': payment.order.status,
            'created_at': payment.created_at,
        }

        return Response(response_data)

    except Payment.DoesNotExist:
        return Response(
            {'error': 'Платеж не найден'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error fetching payment status: {str(e)}")
        return Response(
            {'error': 'Ошибка при получении статуса платежа'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
