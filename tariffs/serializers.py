from rest_framework import serializers
from .models import Tariff


class TariffSerializer(serializers.ModelSerializer):
    """Serializer for Tariff model"""

    class Meta:
        model = Tariff
        fields = ['id', 'name', 'speed', 'price', 'description', 'features', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_price(self, value):
        """Validate that price is positive"""
        if value <= 0:
            raise serializers.ValidationError("Цена должна быть больше нуля")
        return value

    def validate_name(self, value):
        """Validate that name is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Название тарифа не может быть пустым")
        return value
