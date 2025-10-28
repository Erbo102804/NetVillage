from django.urls import path
from . import views

urlpatterns = [
    path('kaspi/', views.create_kaspi_payment, name='payment-kaspi-create'),
    path('webhook/kaspi/', views.kaspi_webhook, name='payment-webhook'),
    path('<int:payment_id>/status/', views.payment_status, name='payment-status'),
]
