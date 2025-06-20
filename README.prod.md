# Aether - Production Deployment Guide

🌌 **Космический документооборот будущего**

## Обзор

Aether - это современная платформа для совместной работы с документами с космическим дизайном и расширенными возможностями коллаборации.

### Системные требования

- **Сервер**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: минимум 4GB, рекомендуется 8GB+
- **Диск**: минимум 50GB свободного места
- **CPU**: 2+ ядра
- **Docker**: версия 20.10+
- **Docker Compose**: версия 2.0+

### Доменные имена

- **Основной домен**: `aethers.ru`
- **Дополнительный домен**: `aetherhelp.store` (перенаправляется на основной)

## Быстрый старт

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo apt install docker-compose-plugin

# Перезагрузка сессии
newgrp docker
```

### 2. Клонирование проекта

```bash
git clone https://github.com/your-username/aether.git
cd aether
```

### 3. Настройка переменных окружения

```bash
# Копирование примера конфигурации
cp env.prod.example .env.prod

# Редактирование конфигурации
nano .env.prod
```

**Обязательные переменные для изменения:**

```env
# Замените на сильные пароли
POSTGRES_PASSWORD=ваш-надежный-пароль-базы-данных
DJANGO_SECRET_KEY=ваш-супер-секретный-ключ-django-минимум-50-символов
MINIO_ROOT_PASSWORD=ваш-надежный-пароль-minio
KEYCLOAK_ADMIN_PASSWORD=ваш-надежный-пароль-keycloak
OIDC_CLIENT_SECRET=ваш-oidc-client-secret
```

### 4. Деплой

```bash
# Установка прав на выполнение
chmod +x deploy.sh

# Запуск деплоя
./deploy.sh
```

### 5. Настройка SSL сертификатов

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификатов
sudo certbot certonly --webroot -w /var/www/certbot -d aethers.ru -d www.aethers.ru
sudo certbot certonly --webroot -w /var/www/certbot -d aetherhelp.store -d www.aetherhelp.store

# Копирование сертификатов
sudo cp /etc/letsencrypt/live/aethers.ru/* docker/ssl/aethers.ru/
sudo cp /etc/letsencrypt/live/aetherhelp.store/* docker/ssl/aetherhelp.store/

# Перезапуск nginx
docker-compose -f docker-compose.prod.yml --env-file .env.prod restart nginx
```

## Структура проекта

```
aether/
├── docker-compose.prod.yml     # Продакшн конфигурация Docker
├── env.prod.example           # Пример переменных окружения
├── deploy.sh                  # Скрипт деплоя
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf         # Основной конфиг nginx
│   │   └── conf.d/            # Конфиги доменов
│   ├── ssl/                   # SSL сертификаты
│   └── keycloak-themes/       # Темы Keycloak
├── src/
│   ├── backend/               # Django backend
│   └── frontend/              # Next.js frontend
└── env.d/
    └── production/            # Продакшн переменные
```

## Сервисы

### Основные сервисы

- **nginx**: Reverse proxy и статические файлы (порты 80, 443)
- **app**: Django backend приложение
- **frontend**: Next.js frontend приложение
- **postgresql**: База данных PostgreSQL
- **redis**: Кэш и сессии
- **keycloak**: Аутентификация и авторизация
- **minio**: S3-совместимое хранилище файлов
- **y-provider**: WebSocket сервер для коллаборации
- **celery**: Асинхронные задачи

### Порты и эндпоинты

- **Основной сайт**: `https://aethers.ru`
- **Админ панель**: `https://aethers.ru/admin/`
- **API**: `https://aethers.ru/api/`
- **Аутентификация**: `https://aethers.ru/auth/`
- **Коллаборация**: `https://aethers.ru/collaboration/`

## Управление

### Команды deploy.sh

```bash
# Полный деплой
./deploy.sh deploy

# Остановка сервисов
./deploy.sh stop

# Перезапуск сервисов
./deploy.sh restart

# Просмотр логов
./deploy.sh logs

# Статус сервисов
./deploy.sh status

# Обновление из Git
./deploy.sh update
```

### Docker Compose команды

```bash
# Просмотр статуса
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps

# Просмотр логов
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f

# Перезапуск сервиса
docker-compose -f docker-compose.prod.yml --env-file .env.prod restart [service_name]

# Выполнение команд в контейнере
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec app python manage.py shell
```

### Django команды

```bash
# Миграции базы данных
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec app python manage.py migrate

# Создание суперпользователя
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec app python manage.py createsuperuser

# Сбор статических файлов
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec app python manage.py collectstatic --noinput

# Консоль Django
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec app python manage.py shell
```

## Мониторинг и логи

### Логи сервисов

```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f

# Конкретный сервис
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f app
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f nginx
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f keycloak
```

### Системные логи

```bash
# Логи Docker
sudo journalctl -u docker.service -f

# Логи системы
sudo tail -f /var/log/syslog
```

### Мониторинг ресурсов

```bash
# Использование ресурсов контейнерами
docker stats

# Дисковое пространство
df -h
docker system df
```

## Резервное копирование

### База данных

```bash
# Создание бэкапа
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec postgresql pg_dump -U aether aether > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec -T postgresql psql -U aether aether < backup.sql
```

### Файлы и volumes

```bash
# Бэкап volumes
docker run --rm -v aether-prod_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
docker run --rm -v aether-prod_minio_data:/data -v $(pwd):/backup alpine tar czf /backup/minio_backup.tar.gz -C /data .
```

## Обновление

### Обновление кода

```bash
# Автоматическое обновление
./deploy.sh update

# Ручное обновление
git pull
docker-compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Обновление системы

```bash
# Обновление пакетов
sudo apt update && sudo apt upgrade -y

# Обновление Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## Безопасность

### Настройки файрвола

```bash
# UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### SSL сертификаты

- Автоматическое обновление через Certbot
- HSTS заголовки включены
- Принудительное перенаправление HTTP → HTTPS

### Переменные окружения

- Все секретные данные в `.env.prod`
- Файл добавлен в `.gitignore`
- Используйте сильные пароли (минимум 20 символов)

## Устранение неполадок

### Частые проблемы

1. **Сервисы не запускаются**
   ```bash
   # Проверка логов
   docker-compose -f docker-compose.prod.yml --env-file .env.prod logs
   
   # Проверка статуса
   docker-compose -f docker-compose.prod.yml --env-file .env.prod ps
   ```

2. **SSL сертификаты не работают**
   ```bash
   # Проверка сертификатов
   sudo certbot certificates
   
   # Обновление сертификатов
   sudo certbot renew
   ```

3. **База данных недоступна**
   ```bash
   # Проверка PostgreSQL
   docker-compose -f docker-compose.prod.yml --env-file .env.prod exec postgresql pg_isready -U aether
   ```

4. **Проблемы с памятью**
   ```bash
   # Очистка неиспользуемых образов
   docker system prune -a
   
   # Мониторинг памяти
   free -h
   docker stats
   ```

### Восстановление системы

```bash
# Полная перезагрузка
./deploy.sh stop
./deploy.sh deploy

# Восстановление из бэкапа
# 1. Остановить сервисы
# 2. Восстановить volumes
# 3. Запустить сервисы
```

## Поддержка

- **Документация**: Этот файл
- **Логи**: `./deploy.sh logs`
- **Статус**: `./deploy.sh status`

---

**Aether** - космический документооборот будущего 🌌✨ 