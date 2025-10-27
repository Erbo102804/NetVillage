from rest_framework import generics
from .models import Tariff
from .serializers import TariffSerializer

class TariffListView(generics.ListAPIView):
    queryset = Tariff.objects.filter(is_active=True)
    serializer_class = TariffSerializer

class TariffDetailView(generics.RetrieveAPIView):
    queryset = Tariff.objects.filter(is_active=True)
    serializer_class = TariffSerializer
