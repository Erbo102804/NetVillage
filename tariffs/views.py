from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Tariff
from .serializers import TariffSerializer
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
def tariff_list(request):
    """
    Получить список всех активных тарифов
    """
    try:
        tariffs = Tariff.objects.filter(is_active=True).order_by('price')
        serializer = TariffSerializer(tariffs, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching tariffs: {str(e)}")
        return Response(
            {'error': 'Ошибка при получении тарифов'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
