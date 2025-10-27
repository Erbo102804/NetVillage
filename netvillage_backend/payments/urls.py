from django.urls import path
from .views import PaymentCreateView, PaymentWebhookView, PaymentStatusView

urlpatterns = [
    path('kaspi/', PaymentCreateView.as_view(), name='payment-kaspi-create'),
    path('webhook/kaspi/', PaymentWebhookView.as_view(), name='payment-webhook'),
    path('<int:pk>/status/', PaymentStatusView.as_view(), name='payment-status'),
]
