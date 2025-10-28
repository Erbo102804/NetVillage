from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Tariff

@api_view(['GET'])
def tariff_list(request):
    tariffs = Tariff.objects.filter(is_active=True)
    data = []
    for tariff in tariffs:
        data.append({
            'id': tariff.id,
            'name': tariff.name,
            'speed': tariff.speed,
            'price': float(tariff.price),
            'description': tariff.description,
            'features': tariff.features,
        })
    return Response(data)
