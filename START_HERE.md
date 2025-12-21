# 🚀 БЫСТРЫЙ ЗАПУСК NetVillage

## ✅ Проект полностью настроен!

В базе данных уже есть:
- **4 тарифа** (Базовый, Стандарт, Премиум, Бизнес)
- **1 пользователь** (создайте суперпользователя для доступа)
- Все миграции применены

---

## 📖 Как запустить проект:

### 1️⃣ Создайте суперпользователя (если еще не создан):

```bash
source venv/bin/activate
python manage.py createsuperuser
```

Введите:
- Username: `admin`
- Email: `admin@netvillage.kz`
- Password: (ваш пароль)

### 2️⃣ Запустите Backend:

```bash
source venv/bin/activate
python manage.py runserver
```

✅ Backend запущен на: **http://localhost:8000/**

### 3️⃣ Откройте второй терминал и запустите Frontend:

```bash
cd frontend
npm install  # только первый раз
npm run dev
```

✅ Frontend запущен на: **http://localhost:3000/**

---

## 🌐 Доступные URL:

| Что | URL | Описание |
|-----|-----|----------|
| **Сайт** | http://localhost:3000/ | Главная страница с тарифами |
| **Админка** | http://localhost:8000/admin/ | Панель администратора |
| **API** | http://localhost:8000/api/ | REST API endpoints |
| **API Docs** | http://localhost:8000/api/ | Browsable API |

---

## 🧪 Как протестировать функционал:

### Тест 1: Просмотр тарифов
1. Откройте http://localhost:3000/
2. Должны увидеть 4 тарифных плана

### Тест 2: Регистрация
1. Нажмите "Регистрация" в навигации
2. Заполните все поля (9 полей)
3. Нажмите "Зарегистрироваться"
4. Вы автоматически войдете в систему

### Тест 3: Добавление в корзину
1. Выберите любой тариф
2. Нажмите "Добавить в корзину"
3. Перейдите в корзину (кнопка вверху)

### Тест 4: Управление корзиной
1. В корзине измените количество (+/-)
2. Удалите товар кнопкой "Удалить"
3. Очистите всю корзину кнопкой "Очистить корзину"

### Тест 5: Оформление заказа
1. Добавьте тариф в корзину
2. Нажмите "Оформить заказ"
3. Заполните форму
4. Подтвердите заказ

### Тест 6: Админка
1. Откройте http://localhost:8000/admin/
2. Войдите (логин/пароль от суперпользователя)
3. Посмотрите разделы:
   - **Тарифы** - управление тарифами
   - **Корзины** - все корзины пользователей
   - **Заказы** - все заказы
   - **Пользователи** - все пользователи

---

## 🛠️ Полезные команды:

### Backend:
```bash
# Активация venv
source venv/bin/activate

# Запуск сервера
python manage.py runserver

# Создание суперпользователя
python manage.py createsuperuser

# Миграции
python manage.py makemigrations
python manage.py migrate

# Загрузить тарифы
python manage.py loaddata tariffs/fixtures/initial_tariffs.json

# Открыть shell
python manage.py shell
```

### Frontend:
```bash
# Переход в директорию
cd frontend

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build
```

---

## 📊 Текущее состояние базы данных:

✅ **Тарифы:** 4 шт
- Базовый: 10,000 ₸/мес (5 Мбит/с)
- Стандарт: 15,000 ₸/мес (10 Мбит/с)
- Премиум: 20,000 ₸/мес (15 Мбит/с)
- Бизнес: 12,990 ₸/мес (200 Мбит/с)

✅ **Миграции:** Все применены
✅ **Зависимости:** Все установлены

---

## 🐛 Решение проблем:

### Проблема: "Module not found"
**Решение:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Проблема: "Cannot connect to server"
**Решение:**
1. Убедитесь, что backend запущен (http://localhost:8000/)
2. Проверьте файл `frontend/src/services/api.js`
3. Убедитесь, что CORS настроен в Django

### Проблема: "Тарифов нет"
**Решение:**
```bash
source venv/bin/activate
python manage.py loaddata tariffs/fixtures/initial_tariffs.json
```

### Проблема: Frontend не запускается
**Решение:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 API Endpoints:

### Аутентификация:
- `POST /api/auth/register/` - Регистрация
- `POST /api/auth/login/` - Вход
- `POST /api/auth/logout/` - Выход
- `GET /api/auth/profile/` - Профиль

### Тарифы:
- `GET /api/tariffs/` - Список тарифов

### Корзина:
- `GET /api/basket/` - Получить корзину
- `POST /api/basket/add/` - Добавить товар
- `PUT /api/basket/item/{id}/` - Обновить товар
- `DELETE /api/basket/item/{id}/` - Удалить товар
- `DELETE /api/basket/clear/` - Очистить корзину

### Заказы:
- `GET /api/orders/` - Список заказов
- `POST /api/orders/` - Создать заказ

---

## ✅ Чеклист готовности:

- [x] База данных создана
- [x] Миграции применены
- [x] Тарифы загружены (4 шт)
- [x] Backend настроен
- [x] Frontend настроен
- [x] API работает
- [ ] Суперпользователь создан (создайте!)
- [ ] Протестирован полный цикл (регистрация → корзина → заказ)

---

## 🎉 Готово к работе!

Теперь вы можете:
1. ✅ Запустить backend и frontend
2. ✅ Зарегистрироваться на сайте
3. ✅ Добавлять тарифы в корзину
4. ✅ Оформлять заказы
5. ✅ Управлять через админ-панель

**Приятной работы с NetVillage!** 🚀

---

**GitHub:** https://github.com/Erbo102804/NetVillage
**Курс:** Programming Languages I
**Преподаватель:** Narmukhamedov R.T.
**Университет:** International University of Central Asia
