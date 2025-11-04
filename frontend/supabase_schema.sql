-- Создание таблицы тарифов
CREATE TABLE IF NOT EXISTS tariffs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    speed VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    tariff_id UUID REFERENCES tariffs(id),
    amount DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы платежей
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(200),
    qr_data TEXT,
    payment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка тестовых тарифов
INSERT INTO tariffs (name, speed, price, description, features) VALUES
('Базовый', '10 Мбит/с', 10000.00, 'Идеально для повседневного использования', '["До 10 Мбит/с", "Безлимитный трафик", "Поддержка 24/7"]'),
('Оптимальный', '25 Мбит/с', 15000.00, 'Отличный выбор для семьи', '["До 25 Мбит/с", "Безлимитный трафик", "Приоритетная поддержка", "Статический IP"]'),
('Премиум', '50 Мбит/с', 20000.00, 'Максимальная скорость для требовательных задач', '["До 50 Мбит/с", "Безлимитный трафик", "Приоритетная поддержка", "Статический IP", "Резервный канал"]');

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
