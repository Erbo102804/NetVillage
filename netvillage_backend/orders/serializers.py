from rest_framework import serializers
from .models import Order
from tariffs.serializers import TariffSerializer

class OrderSerializer(serializers.ModelSerializer):
    tariff_details = TariffSerializer(source='tariff', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
