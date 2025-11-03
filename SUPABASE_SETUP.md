# Настройка Supabase для NetVillage

## Шаг 1: Получите данные для подключения

1. **Откройте ваш проект Supabase:**
   - Перейдите на https://supabase.com/dashboard/project/eabfirqyygcqklupsdop

2. **Получите Database Password:**
   - Перейдите в **Settings** (внизу слева)
   - Выберите **Database**
   - Найдите раздел **Connection string**
   - Скопируйте **Connection pooling** строку (она начинается с `postgresql://`)
   - Или просто скопируйте **пароль** из этой строки

3. **Получите API Key:**
   - Перейдите в **Settings** → **API**
   - Скопируйте **anon** **public** ключ

## Шаг 2: Обновите .env файл

Откройте файл `.env` в вашем проекте и замените:

```env
SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY
DB_PASSWORD=YOUR_SUPABASE_DB_PASSWORD
```

На ваши реальные значения из Supabase.

**Важно:** Connection string выглядит примерно так:
```
postgresql://postgres.eabfirqyygcqklupsdop:[ВАШ-ПАРОЛЬ]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```
Вам нужен только пароль из этой строки (часть `[ВАШ-ПАРОЛЬ]`).

## Шаг 3: Примените миграции

После настройки .env файла выполните:

```bash
# Создайте таблицы в Supabase
python3 manage.py migrate

# Загрузите новые тарифы
python3 manage.py loaddata tariffs/fixtures/initial_tariffs.json

# Создайте суперпользователя
python3 manage.py createsuperuser

# Запустите сервер
python3 manage.py runserver
```

## Новые тарифы

После загрузки fixtures у вас будут следующие тарифы:

1. **Базовый** - 10,000 ₸/мес - 5 Мбит/с
2. **Стандарт** - 15,000 ₸/мес - 10 Мбит/с
3. **Премиум** - 20,000 ₸/мес - 15 Мбит/с

## Проблемы?

### Ошибка подключения к БД
- Проверьте, что скопировали правильный пароль
- Убедитесь, что нет лишних пробелов в .env файле

### Ошибка "relation does not exist"
- Выполните `python3 manage.py migrate`

### Хотите использовать SQLite вместо Supabase?
В файле `.env` закомментируйте Supabase настройки и раскомментируйте SQLite:
```env
# DB_ENGINE=django.db.backends.postgresql
# ...все Supabase настройки...

# Используйте SQLite для локальной разработки
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```
