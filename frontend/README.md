# NetVillage Payment System

Система онлайн-оплаты для интернет-провайдера NetVillage с интеграцией Kaspi Pay.

## Структура проекта

-  - React приложение
-  - Node.js/Express сервер
-  - SQL для создания таблиц

## Быстрый старт

1. Установите зависимости:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Настройте Supabase:
   - Создайте проект на supabase.com
   - Выполните SQL из `supabase_schema.sql`
   - Обновите `.env` файлы с вашими ключами

3. Запустите development серверы:
```bash
./start_dev.sh
```

## Environment Variables

### Backend (.env)
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
KASPI_API_KEY=your_kaspi_api_key
KASPI_MERCHANT_ID=your_merchant_id
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

- `GET /api/tariffs` - Получить список тарифов
- `POST /api/orders` - Создать заказ
- `POST /api/payments/kaspi` - Создать платеж Kaspi
- `POST /api/payments/webhook/kaspi` - Webhook для статусов платежей

## Следующие шаги

1. Настройка реальной интеграции с Kaspi API
2. Добавление аутентификации пользователей
3. Реализация админ-панели
4. Деплой на продакшн
