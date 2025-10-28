from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from orders.models import Order

@api_view(['POST'])
def create_kaspi_payment(request):
    try:
        order_id = request.data.get('order_id')
        
        # Получаем заказ
        order = Order.objects.get(id=order_id)
        
        # Создаем платеж (заглушка для Kaspi)
        payment = Payment.objects.create(
            order=order,
            amount=order.amount,
            payment_method='kaspi',
            status='pending',
            qr_data=f'KASPI_QR_{order.id}',
            payment_url=f'https://kaspi.kz/payment/test/{order.id}',
            kaspi_payment_id=f'kaspi_{order.id}'
        )

        return Response({
            'id': payment.id,
            'order': payment.order.id,
            'amount': float(payment.amount),
            'payment_method': payment.payment_method,
            'status': payment.status,
            'qr_data': payment.qr_data,
            'payment_url': payment.payment_url,
            'kaspi_payment_id': payment.kaspi_payment_id,
            'created_at': payment.created_at,
        }, status=status.HTTP_201_CREATED)

    except Order.DoesNotExist:
        return Response({'error': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def kaspi_webhook(request):
    """
    Webhook для получения статусов платежей от Kaspi
    """
    try:
        payment_id = request.data.get('payment_id')
        status = request.data.get('status')
        transaction_id = request.data.get('transaction_id')
        
        # Находим платеж
        payment = Payment.objects.get(id=payment_id)
        
        # Обновляем статус платежа
        payment.status = status
        if transaction_id:
            payment.transaction_id = transaction_id
        payment.save()
        
        # Если платеж успешен, обновляем статус заказа
        if status == 'completed':
            payment.order.status = 'paid'
            payment.order.save()
        
        return Response({'status': 'success'})
        
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def payment_status(request, payment_id):
    """
    Получение статуса платежа
    """
    try:
        payment = Payment.objects.get(id=payment_id)
        
        return Response({
            'id': payment.id,
            'status': payment.status,
            'amount': float(payment.amount),
            'order_status': payment.order.status,
            'created_at': payment.created_at,
        })
        
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
