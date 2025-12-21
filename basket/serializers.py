from rest_framework import serializers
from .models import Basket, BasketItem
from tariffs.serializers import TariffSerializer


class BasketItemSerializer(serializers.ModelSerializer):
    tariff = TariffSerializer(read_only=True)
    tariff_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = BasketItem
        fields = ['id', 'tariff', 'tariff_id', 'quantity', 'months', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BasketSerializer(serializers.ModelSerializer):
    items = BasketItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Basket
        fields = ['id', 'items', 'total_price', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AddToBasketSerializer(serializers.Serializer):
    tariff_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)
    months = serializers.IntegerField(default=1, min_value=1, max_value=12)


class UpdateBasketItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1, required=False)
    months = serializers.IntegerField(min_value=1, max_value=12, required=False)
