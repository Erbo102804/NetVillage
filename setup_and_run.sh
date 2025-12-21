#!/bin/bash

echo "🚀 Настройка и запуск NetVillage"
echo "================================="
echo ""

# Активация виртуального окружения
echo "📦 Активация виртуального окружения..."
source venv/bin/activate

# Проверка установки зависимостей
echo "📚 Проверка зависимостей..."
pip list | grep Django > /dev/null
if [ $? -ne 0 ]; then
    echo "⚠️ Django не установлен. Установка зависимостей..."
    pip install -r requirements.txt
fi

# Проверка миграций
echo ""
echo "🔄 Проверка миграций..."
python manage.py showmigrations 2>&1 | grep "\[ \]" > /dev/null
if [ $? -eq 0 ]; then
    echo "⚠️ Есть непримененные миграции. Применяю..."
    python manage.py migrate
fi

# Проверка тарифов
echo ""
echo "📋 Проверка тарифов..."
TARIFFS_COUNT=$(python manage.py shell -c "from tariffs.models import Tariff; print(Tariff.objects.count())" 2>/dev/null)
if [ "$TARIFFS_COUNT" = "0" ] || [ -z "$TARIFFS_COUNT" ]; then
    echo "⚠️ Тарифов нет в базе. Загружаю начальные данные..."
    python manage.py loaddata tariffs/fixtures/initial_tariffs.json
fi

# Проверка суперпользователя
echo ""
echo "👤 Проверка суперпользователя..."
python manage.py shell << 'EOF' 2>/dev/null
from django.contrib.auth.models import User
if not User.objects.filter(is_superuser=True).exists():
    print("⚠️ Суперпользователь не создан!")
    print("Создайте командой: python manage.py createsuperuser")
else:
    print("✅ Суперпользователь существует")
EOF

# Статистика
echo ""
echo "📊 Текущая статистика:"
python manage.py shell << 'EOF' 2>/dev/null
from tariffs.models import Tariff
from basket.models import Basket
from orders.models import Order
from django.contrib.auth.models import User

print(f"  • Тарифов: {Tariff.objects.count()}")
print(f"  • Корзин: {Basket.objects.count()}")
print(f"  • Заказов: {Order.objects.count()}")
print(f"  • Пользователей: {User.objects.count()}")
EOF

echo ""
echo "================================="
echo "✅ Проект готов к работе!"
echo ""
echo "🌐 Доступные команды:"
echo ""
echo "  Запуск Backend:"
echo "    source venv/bin/activate"
echo "    python manage.py runserver"
echo "    → http://localhost:8000/"
echo "    → Admin: http://localhost:8000/admin/"
echo ""
echo "  Запуск Frontend:"
echo "    cd frontend"
echo "    npm install  # первый раз"
echo "    npm run dev"
echo "    → http://localhost:3000/"
echo ""
echo "  Создание суперпользователя:"
echo "    source venv/bin/activate"
echo "    python manage.py createsuperuser"
echo ""
echo "================================="
