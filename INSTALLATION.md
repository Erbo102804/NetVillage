# Инструкция по установке NetVillage

## Для Windows

### 1. Установите Python 3.12
Скачайте и установите Python с официального сайта:
https://www.python.org/downloads/

**Важно:** При установке поставьте галочку "Add Python to PATH"

### 2. Клонируйте репозиторий
Откройте командную строку (cmd) или PowerShell:
```bash
cd C:\Users\ВашеИмя\Documents
git clone https://github.com/Erbo102804/NetVillage.git
cd NetVillage
```

### 3. Создайте виртуальное окружение
```bash
python -m venv venv
venv\Scripts\activate
```

### 4. Установите зависимости
```bash
pip install -r requirements.txt
```

### 5. Настройте переменные окружения
Файл `.env` уже создан, но вы можете его отредактировать:
```bash
notepad .env
```

### 6. Выполните миграции базы данных
```bash
python manage.py migrate
```

### 7. Загрузите начальные тарифы
```bash
python manage.py loaddata tariffs/fixtures/initial_tariffs.json
```

### 8. Создайте администратора
```bash
python manage.py createsuperuser
```
Введите:
- Username (например: admin)
- Email (например: admin@netvillage.kz)
- Password (минимум 8 символов)

### 9. Запустите сервер
```bash
python manage.py runserver
```

### 10. Откройте в браузере
- **Главная страница:** http://localhost:8000
- **Админ-панель:** http://localhost:8000/admin/
- **API:** http://localhost:8000/api/health/

---

## Для macOS/Linux

### 1. Установите Python 3.12
**macOS:**
```bash
brew install python@3.12
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3.12 python3.12-venv python3-pip
```

### 2. Клонируйте репозиторий
```bash
cd ~/Documents
git clone https://github.com/Erbo102804/NetVillage.git
cd NetVillage
```

### 3. Создайте виртуальное окружение
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Установите зависимости
```bash
pip install -r requirements.txt
```

### 5. Настройте переменные окружения
Файл `.env` уже создан, но вы можете его отредактировать:
```bash
nano .env
# или
vim .env
```

### 6. Выполните миграции базы данных
```bash
python manage.py migrate
```

### 7. Загрузите начальные тарифы
```bash
python manage.py loaddata tariffs/fixtures/initial_tariffs.json
```

### 8. Создайте администратора
```bash
python manage.py createsuperuser
```
Введите:
- Username (например: admin)
- Email (например: admin@netvillage.kz)
- Password (минимум 8 символов)

### 9. Запустите сервер
```bash
python manage.py runserver
```

### 10. Откройте в браузере
- **Главная страница:** http://localhost:8000
- **Админ-панель:** http://localhost:8000/admin/
- **API:** http://localhost:8000/api/health/

---

## Проверка установки

### 1. Проверьте API
Откройте http://localhost:8000/api/health/ - должно вернуть:
```json
{
  "status": "OK",
  "message": "NetVillage API is running"
}
```

### 2. Проверьте тарифы
Откройте http://localhost:8000/api/tariffs/ - должен показать 4 тарифа

### 3. Проверьте админку
1. Откройте http://localhost:8000/admin/
2. Войдите с созданным логином/паролем
3. Проверьте разделы: Tariffs, Orders, Payments

### 4. Проверьте фронтенд
Откройте http://localhost:8000 - должна открыться красивая страница с тарифами

---

## Возможные проблемы и решения

### Ошибка: "python не найден"
**Windows:**
- Переустановите Python с галочкой "Add to PATH"
- Или используйте `py` вместо `python`

**macOS/Linux:**
- Используйте `python3` вместо `python`

### Ошибка: "pip не найден"
```bash
python -m pip install --upgrade pip
```

### Ошибка: "порт 8000 занят"
Запустите на другом порту:
```bash
python manage.py runserver 8001
```

### Ошибка при миграциях
Удалите базу данных и создайте заново:
```bash
# Windows
del db.sqlite3
# macOS/Linux
rm db.sqlite3

python manage.py migrate
python manage.py loaddata tariffs/fixtures/initial_tariffs.json
```

### Ошибка "ModuleNotFoundError"
Убедитесь, что виртуальное окружение активировано и зависимости установлены:
```bash
# Активируйте venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt
```

---

## Остановка сервера

Нажмите `Ctrl+C` в командной строке, где запущен сервер

---

## Деактивация виртуального окружения

Когда закончите работу:
```bash
deactivate
```

---

## Следующие шаги

После установки вы можете:

1. **Добавить свои тарифы** через админку
2. **Протестировать оформление заказа** на главной странице
3. **Настроить Kaspi интеграцию** (см. README.md)
4. **Кастомизировать дизайн** в файлах frontend/

---

## Нужна помощь?

Если возникли проблемы, создайте issue в репозитории GitHub.
