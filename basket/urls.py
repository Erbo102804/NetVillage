from django.urls import path
from . import views

urlpatterns = [
    path('', views.basket_list, name='basket-list'),
    path('add/', views.add_to_basket, name='add-to-basket'),
    path('item/<int:item_id>/', views.basket_item_detail, name='basket-item-detail'),
    path('clear/', views.clear_basket, name='clear-basket'),
]
