from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from tariffs.models import Tariff

@api_view(['POST'])
def create_order(request):
    try:
        tariff_id = request.data.get('tariff')
        customer_name = request.data.get('customer_name')
        customer_email = request.data.get('customer_email')
        customer_phone = request.data.get('customer_phone', '')
        address = request.data.get('address', '')

        # Получаем тариф
        tariff = Tariff.objects.get(id=tariff_id)
        
        # Создаем заказ
        order = Order.objects.create(
            tariff=tariff,
            amount=tariff.price,
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            address=address,
            status='pending'
        )

        return Response({
            'id': order.id,
            'tariff': order.tariff.id,
            'amount': float(order.amount),
            'customer_name': order.customer_name,
            'customer_email': order.customer_email,
            'customer_phone': order.customer_phone,
            'address': order.address,
            'status': order.status,
            'created_at': order.created_at,
        }, status=status.HTTP_201_CREATED)

    except Tariff.DoesNotExist:
        return Response({'error': 'Тариф не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
