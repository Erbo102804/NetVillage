from rest_framework import serializers
from .models import Payment
from orders.serializers import OrderSerializer


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    order_details = OrderSerializer(source='order', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order', 'order_details', 'amount', 'payment_method',
                  'status', 'transaction_id', 'qr_data', 'payment_url',
                  'kaspi_payment_id', 'metadata', 'created_at', 'updated_at']
        read_only_fields = ['id', 'amount', 'status', 'transaction_id', 'qr_data',
                           'payment_url', 'kaspi_payment_id', 'created_at', 'updated_at']

    def validate_payment_method(self, value):
        """Validate payment method"""
        valid_methods = ['kaspi', 'card', 'cash']
        if value not in valid_methods:
            raise serializers.ValidationError(
                f"Неверный метод оплаты. Допустимые методы: {', '.join(valid_methods)}"
            )
        return value


class PaymentCreateSerializer(serializers.Serializer):
    """Serializer for creating payments"""
    order_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(
        choices=['kaspi', 'card', 'cash'],
        default='kaspi'
    )


class PaymentStatusSerializer(serializers.Serializer):
    """Serializer for payment status response"""
    id = serializers.IntegerField()
    status = serializers.CharField()
    payment_method = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = serializers.CharField(required=False)
    payment_url = serializers.URLField(required=False)


class KaspiWebhookSerializer(serializers.Serializer):
    """Serializer for Kaspi webhook data"""
    paymentId = serializers.CharField()
    status = serializers.ChoiceField(choices=['completed', 'failed', 'pending'])
    transactionId = serializers.CharField(required=False)
    metadata = serializers.JSONField(required=False)
