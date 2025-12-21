#!/bin/bash

# Скрипт для тестирования функционала NetVillage

echo "🧪 Тестирование функционала NetVillage"
echo "======================================"
echo ""

# Проверка базы данных
echo "📊 Проверка базы данных..."
if [ -f "db.sqlite3" ]; then
    echo "✅ База данных существует"
else
    echo "❌ База данных не найдена. Запустите миграции!"
    exit 1
fi

# Проверка тарифов в БД
echo ""
echo "📋 Проверка тарифов в базе данных..."
python manage.py shell << EOF
from tariffs.models import Tariff
tariffs = Tariff.objects.all()
print(f"\n Всего тарифов: {tariffs.count()}")
if tariffs.count() > 0:
    print("✅ Тарифы найдены в базе данных:")
    for t in tariffs:
        print(f"  - {t.name}: {t.price} ₸/мес ({t.speed})")
else:
    print("❌ Тарифов нет в базе! Загрузите fixture:")
    print("   python manage.py loaddata tariffs/fixtures/initial_tariffs.json")
EOF

# Проверка корзин
echo ""
echo "🛒 Проверка корзин..."
python manage.py shell << EOF
from basket.models import Basket, BasketItem
baskets = Basket.objects.all()
print(f"\nВсего корзин: {baskets.count()}")
if baskets.count() > 0:
    for b in baskets:
        print(f"  - Корзина #{b.id}: {b.total_items} товаров, {b.total_price} ₸")
EOF

# Проверка пользователей
echo ""
echo "👥 Проверка пользователей..."
python manage.py shell << EOF
from django.contrib.auth.models import User
users = User.objects.all()
print(f"\nВсего пользователей: {users.count()}")
if users.filter(is_superuser=True).exists():
    print("✅ Суперпользователь создан")
else:
    print("⚠️ Суперпользователь не создан. Создайте:")
    print("   python manage.py createsuperuser")
EOF

# Проверка заказов
echo ""
echo "📦 Проверка заказов..."
python manage.py shell << EOF
from orders.models import Order
orders = Order.objects.all()
print(f"\nВсего заказов: {orders.count()}")
if orders.count() > 0:
    for o in orders[:5]:  # Показываем первые 5
        print(f"  - Заказ #{o.id}: {o.customer_name}, статус: {o.status}")
EOF

echo ""
echo "======================================"
echo "✅ Проверка завершена!"
echo ""
echo "📝 Для запуска сервера:"
echo "   Backend:  python manage.py runserver"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Admin:    http://localhost:8000/admin/"
echo "   API:      http://localhost:8000/api/"
echo "   Frontend: http://localhost:3000/"
