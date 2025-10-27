from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('tariffs/', include('tariffs.urls')),
        path('orders/', include('orders.urls')),
        path('payments/', include('payments.urls')),
    ])),
]
