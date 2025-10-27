from django.db import models
from orders.models import Order

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('kaspi', 'Kaspi'),
        ('card', 'Банковская карта'),
        ('cash', 'Наличные'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('completed', 'Завершен'),
        ('failed', 'Ошибка'),
        ('refunded', 'Возвращен'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=200, blank=True)
    qr_data = models.TextField(blank=True)
    payment_url = models.URLField(blank=True)
    kaspi_payment_id = models.CharField(max_length=200, blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.id} - {self.payment_method} - {self.status}"

    class Meta:
        db_table = 'payments'
