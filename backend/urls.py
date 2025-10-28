from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.db.models import Count, Sum
from orders.models import Order
from payments.models import Payment
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'OK', 'message': 'NetVillage API is running'})

def admin_dashboard(request):
    # Статистика для админки
    total_orders = Order.objects.count()
    total_revenue = Payment.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
    pending_orders = Order.objects.filter(status='pending').count()
    
    context = {
        'total_orders': total_orders,
        'total_revenue': float(total_revenue),
        'pending_orders': pending_orders,
    }
    return render(request, 'admin/dashboard.html', context)

urlpatterns = [
    path('admin/dashboard/', admin.site.admin_view(admin_dashboard), name='admin-dashboard'),
    path('admin/', admin.site.urls),
    path('api/health/', health_check),
    path('api/tariffs/', include('tariffs.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
]
