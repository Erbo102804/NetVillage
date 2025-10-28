from django.urls import path
from . import views

urlpatterns = [
    path('', views.tariff_list, name='tariff-list'),
]
