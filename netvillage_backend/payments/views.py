from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order

class PaymentCreateView(APIView):
    def post(self, request):
        order_id = request.data.get('order_id')
        
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        # Создаем платеж (заглушка для Kaspi)
        payment_data = {
            'order': order.id,
            'amount': order.amount,
            'payment_method': 'kaspi',
            'qr_data': f'KASPI_QR_{order.id}',
            'payment_url': f'https://kaspi.kz/payment/test/{order.id}',
            'kaspi_payment_id': f'kaspi_{order.id}'
        }

        serializer = PaymentSerializer(data=payment_data)
        if serializer.is_valid():
            payment = serializer.save()
            return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentWebhookView(APIView):
    def post(self, request):
        # Обработка вебхука от Kaspi
        payment_id = request.data.get('payment_id')
        status = request.data.get('status')
        transaction_id = request.data.get('transaction_id')

        try:
            payment = Payment.objects.get(id=payment_id)
            payment.status = status
            if transaction_id:
                payment.transaction_id = transaction_id
            payment.save()

            # Обновляем статус заказа если платеж завершен
            if status == 'completed':
                payment.order.status = 'paid'
                payment.order.save()

            return Response({'status': 'success'})
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

class PaymentStatusView(generics.RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
