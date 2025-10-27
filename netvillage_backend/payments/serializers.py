from rest_framework import serializers
from .models import Payment
from orders.serializers import OrderSerializer

class PaymentSerializer(serializers.ModelSerializer):
    order_details = OrderSerializer(source='order', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
