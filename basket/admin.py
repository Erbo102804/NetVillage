from django.contrib import admin
from .models import Basket, BasketItem


class BasketItemInline(admin.TabularInline):
    model = BasketItem
    extra = 0
    readonly_fields = ['total_price', 'created_at']


@admin.register(Basket)
class BasketAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'total_items', 'total_price', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'user__email', 'session_key']
    readonly_fields = ['total_price', 'total_items', 'created_at', 'updated_at']
    inlines = [BasketItemInline]


@admin.register(BasketItem)
class BasketItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'basket', 'tariff', 'quantity', 'months', 'total_price', 'created_at']
    list_filter = ['created_at', 'tariff']
    search_fields = ['basket__user__username', 'tariff__name']
    readonly_fields = ['total_price', 'created_at', 'updated_at']
