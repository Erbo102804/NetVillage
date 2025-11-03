from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.db.models import Count, Sum
from django.conf import settings
from django.conf.urls.static import static
from orders.models import Order
from payments.models import Payment
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os

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

def frontend_index(request):
    """Serve frontend index.html"""
    return render(request, 'frontend/index.html', {})

urlpatterns = [
    path('', frontend_index, name='home'),
    path('admin/dashboard/', admin.site.admin_view(admin_dashboard), name='admin-dashboard'),
    path('admin/', admin.site.urls),
    path('api/health/', health_check),
    path('api/tariffs/', include('tariffs.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    from django.views.static import serve

    urlpatterns += [
        path('styles.css', serve, {'document_root': os.path.join(settings.BASE_DIR, 'frontend'), 'path': 'styles.css'}),
        path('app.js', serve, {'document_root': os.path.join(settings.BASE_DIR, 'frontend'), 'path': 'app.js'}),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
