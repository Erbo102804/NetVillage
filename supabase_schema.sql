-- NetVillage Database Schema for Supabase PostgreSQL

-- 1. Создание таблицы тарифов
CREATE TABLE IF NOT EXISTS tariffs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    speed VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    tariff_id INTEGER NOT NULL REFERENCES tariffs(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(254) NOT NULL,
    customer_phone VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'failed', 'cancelled'))
);

-- 3. Создание таблицы платежей
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(200),
    qr_data TEXT,
    payment_url VARCHAR(200),
    kaspi_payment_id VARCHAR(200),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_method_check CHECK (payment_method IN ('kaspi', 'card', 'cash')),
    CONSTRAINT payments_status_check CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- 4. Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_tariffs_active ON tariffs(is_active);

-- 5. Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Триггеры для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_tariffs_updated_at ON tariffs;
CREATE TRIGGER update_tariffs_updated_at BEFORE UPDATE ON tariffs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Вставка начальных тарифов
INSERT INTO tariffs (name, speed, price, description, features, is_active, created_at, updated_at)
VALUES
    ('Базовый', '5 Мбит/с', 10000.00, 'Базовый тариф для повседневного использования интернета',
     '["Скорость до 5 Мбит/с", "Безлимитный трафик", "Стабильное соединение", "Круглосуточная поддержка"]'::jsonb,
     true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Стандарт', '10 Мбит/с', 15000.00, 'Оптимальный выбор для семьи',
     '["Скорость до 10 Мбит/с", "Безлимитный трафик", "Просмотр HD видео", "Онлайн игры", "Круглосуточная поддержка"]'::jsonb,
     true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Премиум', '15 Мбит/с', 20000.00, 'Максимальная скорость для требовательных пользователей',
     '["Скорость до 15 Мбит/с", "Безлимитный трафик", "HD видео без буферизации", "Онлайн игры в высшем качестве", "Приоритетная техподдержка"]'::jsonb,
     true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 8. Проверка созданных таблиц
SELECT 'Tables created successfully!' as status;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('tariffs', 'orders', 'payments');
