# 🚀 Aether Production Deployment

Инструкция по развертыванию проекта Aether в продакшн режиме на сервере с IP `45.146.166.126`.

## 📋 Требования

- Docker (версия 20.10+)
- Docker Compose (версия 2.0+)
- Минимум 4GB RAM
- Минимум 20GB свободного места

## 🏗️ Архитектура

Продакшн развертывание включает:

- **Frontend**: Next.js приложение с космическим дизайном Aether (порт 3000)
- **Backend**: Django приложение с Gunicorn (порт 8071)
- **Database**: PostgreSQL 16 (внутренняя сеть)
- **Auth**: Keycloak с кастомной темой Aether (порт 8083)
- **Storage**: MinIO для файлов (порт 9001)
- **Cache**: Redis (внутренняя сеть)
- **Proxy**: Nginx для статических файлов (порт 8083)

## 🚀 Быстрый запуск

### Для Linux/macOS:
```bash
./start-production.sh
```

### Для Windows:
```bash
docker-compose -f compose-production.yml up -d --build
```

## 📂 Структура файлов

```
├── compose-production.yml           # Продакшн Docker Compose
├── env.d/production/               # Переменные окружения для продакшна
│   ├── common                      # Общие настройки Django
│   ├── postgresql                  # Настройки PostgreSQL
│   └── kc_postgresql              # Настройки PostgreSQL для Keycloak
├── docker/
│   ├── auth/realm.json            # Конфигурация Keycloak для продакшна
│   └── keycloak-themes/aether/    # Кастомная тема Aether
└── start-production.sh            # Скрипт автоматического развертывания
```

## 🔧 Конфигурация

### Основные настройки (env.d/production/common)

- **IP сервера**: `45.146.166.126`
- **Протокол**: HTTP (без SSL)
- **Django режим**: Production
- **Allowed Hosts**: `45.146.166.126, localhost`

### Безопасность

⚠️ **ВАЖНО**: Измените следующие секретные ключи перед развертыванием:

```bash
# В файле env.d/production/common
DJANGO_SECRET_KEY=Aether-Production-Secret-Key-2025-Change-This-In-Real-Deployment
OIDC_RP_CLIENT_SECRET=Aether-OIDC-Client-Secret-2025-Change-This-In-Real-Deployment

# В файле env.d/production/postgresql
POSTGRES_PASSWORD=aether_strong_password_2025

# В файле env.d/production/kc_postgresql
POSTGRES_PASSWORD=keycloak_strong_password_2025
```

## 🌐 Доступные сервисы

После успешного развертывания сервисы будут доступны по следующим адресам:

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | http://45.146.166.126:3000 | Главное веб-приложение Aether |
| **Backend API** | http://45.146.166.126:8071 | REST API документов |
| **Keycloak** | http://45.146.166.126:8083 | Система аутентификации |
| **MinIO Console** | http://45.146.166.126:9001 | Управление файлами |

## 🔑 Учетные данные по умолчанию

### Keycloak Admin
- **Логин**: `admin`
- **Пароль**: `aether_keycloak_admin_2025`

### MinIO
- **Логин**: `aether_minio`
- **Пароль**: `aether_minio_password_2025`

### Тестовый пользователь Keycloak
- **Логин**: `impress`
- **Пароль**: `impress`

## 📋 Команды управления

### Запуск
```bash
docker-compose -f compose-production.yml up -d
```

### Остановка
```bash
docker-compose -f compose-production.yml down
```

### Просмотр логов
```bash
# Все сервисы
docker-compose -f compose-production.yml logs -f

# Конкретный сервис
docker-compose -f compose-production.yml logs -f app-prod
docker-compose -f compose-production.yml logs -f frontend-production
docker-compose -f compose-production.yml logs -f keycloak
```

### Перезапуск сервиса
```bash
docker-compose -f compose-production.yml restart app-prod
```

### Выполнение команд Django
```bash
# Миграции
docker-compose -f compose-production.yml exec app-prod python manage.py migrate

# Создание суперпользователя
docker-compose -f compose-production.yml exec app-prod python manage.py createsuperuser

# Сбор статических файлов
docker-compose -f compose-production.yml exec app-prod python manage.py collectstatic --noinput
```

## 🐛 Устранение неполадок

### Проверка статуса сервисов
```bash
docker-compose -f compose-production.yml ps
```

### Проверка здоровья контейнеров
```bash
docker-compose -f compose-production.yml top
```

### Очистка и перезапуск
```bash
docker-compose -f compose-production.yml down --remove-orphans
docker-compose -f compose-production.yml up -d --build
```

### Проблемы с подключением

1. **Проверьте порты**: Убедитесь, что порты 3000, 8071, 8083, 9001 открыты
2. **Проверьте брандмауэр**: Убедитесь, что брандмауэр не блокирует соединения
3. **Проверьте DNS**: Убедитесь, что IP `45.146.166.126` доступен

### Проблемы с базой данных

```bash
# Проверка логов PostgreSQL
docker-compose -f compose-production.yml logs postgresql

# Подключение к базе данных
docker-compose -f compose-production.yml exec postgresql psql -U aether_user -d aether_prod
```

## 🔄 Обновление

### Обновление кода
```bash
git pull origin main
docker-compose -f compose-production.yml up -d --build
```

### Обновление зависимостей
```bash
docker-compose -f compose-production.yml build --no-cache
docker-compose -f compose-production.yml up -d
```

## 💾 Резервное копирование

### База данных
```bash
docker-compose -f compose-production.yml exec postgresql pg_dump -U aether_user -d aether_prod > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Файлы
```bash
docker-compose -f compose-production.yml exec minio tar -czf /tmp/media_backup_$(date +%Y%m%d_%H%M%S).tar.gz /data
```

## 🛡️ Безопасность

### Рекомендации для продакшна

1. **Измените все пароли по умолчанию**
2. **Настройте HTTPS** (добавьте SSL сертификаты)
3. **Ограничьте доступ к портам** (используйте firewall)
4. **Регулярно обновляйте** образы Docker
5. **Настройте мониторинг** (Prometheus/Grafana)
6. **Создавайте резервные копии** ежедневно

### Настройка HTTPS (опционально)

Для настройки HTTPS добавьте SSL сертификаты и обновите конфигурацию Nginx:

```bash
# Добавьте в docker/files/etc/nginx/conf.d/default.conf
server {
    listen 443 ssl;
    ssl_certificate /etc/ssl/certs/aether.crt;
    ssl_certificate_key /etc/ssl/private/aether.key;
    # ... остальная конфигурация
}
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи сервисов
2. Убедитесь в правильности конфигурации
3. Проверьте доступность портов
4. Обратитесь к документации Docker/Docker Compose

---

**Успешного развертывания! 🚀** 