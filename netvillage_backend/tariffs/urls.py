from django.urls import path
from .views import TariffListView, TariffDetailView

urlpatterns = [
    path('', TariffListView.as_view(), name='tariff-list'),
    path('<int:pk>/', TariffDetailView.as_view(), name='tariff-detail'),
]
