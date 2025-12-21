from django.db import models
from django.contrib.auth.models import User
from tariffs.models import Tariff


class Basket(models.Model):
    """Корзина пользователя"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='baskets', null=True, blank=True)
    session_key = models.CharField(max_length=255, blank=True, null=True)  # Для анонимных пользователей
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"Корзина {self.user.username}"
        return f"Анонимная корзина {self.session_key}"

    @property
    def total_price(self):
        """Общая стоимость корзины"""
        return sum(item.total_price for item in self.items.all())

    @property
    def total_items(self):
        """Общее количество товаров"""
        return sum(item.quantity for item in self.items.all())

    class Meta:
        db_table = 'baskets'
        ordering = ['-created_at']


class BasketItem(models.Model):
    """Элемент корзины"""
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE, related_name='items')
    tariff = models.ForeignKey(Tariff, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    months = models.PositiveIntegerField(default=1, help_text='Количество месяцев подписки')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tariff.name} x {self.quantity} ({self.months} мес.)"

    @property
    def total_price(self):
        """Стоимость позиции"""
        return self.tariff.price * self.quantity * self.months

    class Meta:
        db_table = 'basket_items'
        ordering = ['-created_at']
