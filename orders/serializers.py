from rest_framework import serializers
from .models import Order
from tariffs.serializers import TariffSerializer
import re


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    tariff_details = TariffSerializer(source='tariff', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'tariff', 'tariff_details', 'amount', 'customer_name',
                  'customer_email', 'customer_phone', 'address', 'status',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'amount', 'status', 'created_at', 'updated_at']

    def validate_customer_phone(self, value):
        """Validate phone number format (Kazakhstan format)"""
        if value and value.strip():  # Only validate if phone is provided and not empty
            # Remove spaces and special characters
            phone = re.sub(r'[\s\-\(\)]', '', value)
            # Check if it matches Kazakhstan phone format (more flexible)
            if not re.match(r'^\+?7\d{10}$', phone) and not re.match(r'^\d{10,11}$', phone):
                raise serializers.ValidationError(
                    "Неверный формат телефона. Пример: +77771234567 или 87771234567"
                )
        return value

    def validate_customer_name(self, value):
        """Validate customer name"""
        if not value.strip():
            raise serializers.ValidationError("Имя клиента не может быть пустым")
        if len(value) < 2:
            raise serializers.ValidationError("Имя клиента слишком короткое")
        return value

    def create(self, validated_data):
        """Create order with tariff price"""
        tariff = validated_data['tariff']
        validated_data['amount'] = tariff.price
        return super().create(validated_data)


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating orders"""
    tariff_id = serializers.IntegerField()
    customer_name = serializers.CharField(max_length=200)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
