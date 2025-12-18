# Deployment Guide - Restaurant Service

## Deployment на Render.com

### Шаг 1: Подготовка репозитория

Убедитесь, что все изменения закоммичены и запушены в GitHub:
```bash
git add .
git commit -m "Add deployment configuration"
git push
```

### Шаг 2: Создание аккаунта на Render

1. Перейдите на [render.com](https://render.com)
2. Зарегистрируйтесь или войдите через GitHub
3. Подключите ваш GitHub репозиторий

### Шаг 3: Создание Backend сервиса

1. На дашборде Render нажмите **"New +"** → **"Web Service"**
2. Выберите ваш репозиторий `restraunt-service-delivery_room-4`
3. Настройте следующие параметры:

   - **Name**: `restaurant-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python -m backend.database.seed_data && uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. В разделе **Advanced** → **Health Check Path** укажите: `/health`
5. Нажмите **"Create Web Service"**
6. Дождитесь завершения деплоя (5-10 минут)
7. **Скопируйте URL вашего backend** (например: `https://restaurant-backend-xxxx.onrender.com`)

### Шаг 4: Создание Frontend сервиса

1. Снова нажмите **"New +"** → **"Static Site"**
2. Выберите тот же репозиторий
3. Настройте следующие параметры:

   - **Name**: `restaurant-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

4. В разделе **Environment Variables** добавьте:
   - **Key**: `VITE_API_URL`
   - **Value**: URL вашего backend из шага 3 (например: `https://restaurant-backend-xxxx.onrender.com`)

5. В разделе **Redirects/Rewrites** добавьте:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Type**: `Rewrite`

6. Нажмите **"Create Static Site"**
7. Дождитесь завершения деплоя

### Шаг 5: Проверка работы

После завершения деплоя:

1. Откройте URL вашего frontend (например: `https://restaurant-frontend-xxxx.onrender.com`)
2. Проверьте, что рестораны загружаются корректно
3. Попробуйте открыть меню ресторана
4. Проверьте работу корзины

### Важные примечания

⚠️ **Бесплатный план Render:**
- Backend "засыпает" после 15 минут неактивности
- Первый запрос после "сна" может занять 30-60 секунд
- Для production рекомендуется платный план ($7/месяц)

⚠️ **SQLite в production:**
- Текущая конфигурация использует SQLite
- База данных будет пересоздаваться при каждом деплое
- Для сохранения данных рекомендуется использовать PostgreSQL

### Автоматический деплой

Render автоматически деплоит приложение при каждом push в main ветку GitHub.

### Устранение проблем

**Backend не запускается:**
```bash
# Проверьте логи в Render Dashboard → Logs
# Убедитесь, что все зависимости установлены
```

**Frontend не подключается к Backend:**
```bash
# Проверьте, что VITE_API_URL правильно настроен
# Откройте DevTools → Network и проверьте запросы
# Убедитесь, что backend работает и отвечает на /health
```

**CORS ошибки:**
```bash
# Убедитесь, что URL frontend добавлен в allow_origins в backend/main.py
```

### Обновление приложения

```bash
# Внесите изменения в код
git add .
git commit -m "Your changes"
git push

# Render автоматически задеплоит обновления
```
