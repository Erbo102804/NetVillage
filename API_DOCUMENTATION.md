# NetVillage Payment API Documentation

## Base URL
`http://localhost:5000/api`

## Endpoints

### Health Check
- **GET** `/health`
- Проверка статуса API

### Тарифы
- **GET** `/tariffs`
- Получить список всех тарифов

### Заказы
- **POST** `/orders`
- Создать новый заказ

**Body:**
```json
{
  "tariff_id": "uuid",
  "customer_name": "string",
  "customer_email": "string",
  "customer_phone": "string",
  "address": "string"
}
```

- **GET** `/orders/:id`
- Получить информацию о заказе

### Платежи
- **POST** `/payments/kaspi`
- Создать платеж Kaspi

**Body:**
```json
{
  "order_id": "uuid"
}
```

- **POST** `/payments/webhook/kaspi`
- Webhook для обработки статусов платежей от Kaspi

- **GET** `/payments/:id/status`
- Получить статус платежа

## Примеры использования

### Создание заказа и платежа
```javascript
// 1. Получить тарифы
const tariffs = await fetch('/api/tariffs');

// 2. Создать заказ
const order = await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({
    tariff_id: 'tariff-uuid',
    customer_name: 'Иван Иванов',
    customer_email: 'ivan@example.com',
    customer_phone: '+77771234567',
    address: 'г. Село, ул. Центральная, д. 1'
  })
});

// 3. Создать платеж
const payment = await fetch('/api/payments/kaspi', {
  method: 'POST',
  body: JSON.stringify({
    order_id: order.id
  })
});
```

## Webhook Format

Kaspi будет отправлять вебхуки в формате:
```json
{
  "paymentId": "payment-uuid",
  "status": "completed",
  "transactionId": "txn_123456"
}
```

## Статусы

### Заказы:
- `pending` - ожидает оплаты
- `paid` - оплачен
- `failed` - ошибка оплаты
- `cancelled` - отменен

### Платежи:
- `pending` - ожидает оплаты
- `completed` - завершен успешно
- `failed` - ошибка
- `refunded` - возвращен
