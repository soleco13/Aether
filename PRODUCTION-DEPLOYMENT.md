# 🚀 Aether Production Deployment Guide (SSL/HTTPS)

Полное руководство по развертыванию проекта Aether в production окружении с SSL поддержкой.

## 📋 Требования

### Системные требования
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Минимум 4GB (рекомендуется 8GB+)
- **Storage**: Минимум 20GB свободного места
- **CPU**: 2+ ядра

### Программное обеспечение
- Docker 20.10+
- Docker Compose 2.0+
- **SSL сертификат** для домена/IP

### Сетевые требования
- Порты: 3000, 8071, 8080, 8083, 4444, 9000, 9001
- Домен или статический IP с настроенным SSL

## 🛡️ SSL Конфигурация

### Предварительные требования
Перед развертыванием убедитесь что:

1. **SSL сертификат установлен** на сервере
2. **Веб-сервер** (nginx/Apache) настроен для HTTPS
3. **Порты открыты** в firewall для HTTPS трафика

### Настройка SSL на сервере

```bash
# Пример с certbot для Let's Encrypt
sudo apt install certbot nginx
sudo certbot --nginx -d yourdomain.com

# Или установка собственного сертификата
sudo mkdir -p /etc/ssl/aether
sudo cp your-cert.crt /etc/ssl/aether/
sudo cp your-key.key /etc/ssl/aether/
```

## 🔧 Конфигурация

### 1. Настройка переменных окружения

Основные файлы конфигурации:
- `env.d/production/common` - основные настройки
- `env.d/production/postgresql` - база данных
- `env.d/production/kc_postgresql` - Keycloak база

### 2. Важные параметры безопасности

В `env.d/production/common`:

```bash
# SSL Security Settings
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https")
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_PRELOAD=True
SECURE_HSTS_INCLUDE_SUBDOMAINS=True

# HTTPS URLs
IMPRESS_BASE_URL="https://45.146.166.126:8071"
LOGIN_REDIRECT_URL=https://45.146.166.126:3000
CORS_ALLOWED_ORIGINS=["https://45.146.166.126:3000"]
```

## 🚀 Процесс развертывания

### Метод 1: Автоматический скрипт (рекомендуется)

```bash
# Linux/macOS
chmod +x start-production.sh
./start-production.sh

# Windows PowerShell
.\run-production.ps1
```

### Метод 2: Ручное развертывание

```bash
# 1. Остановка существующих сервисов
docker-compose -f compose-production.yml down

# 2. Сборка образов
docker-compose -f compose-production.yml build --no-cache

# 3. Запуск сервисов
docker-compose -f compose-production.yml up -d

# 4. Проверка статуса
docker-compose -f compose-production.yml ps
```

## 🌐 Доступ к сервисам

После успешного развертывания сервисы доступны по HTTPS:

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | https://45.146.166.126:3000 | Основное веб-приложение |
| **Backend API** | https://45.146.166.126:8071 | Django REST API |
| **Keycloak** | https://45.146.166.126:8083 | Управление пользователями |
| **MinIO Console** | https://45.146.166.126:9001 | Файловое хранилище |

## 🔑 Учетные данные по умолчанию

### Django Admin
- **Username**: admin
- **Password**: admin
- **URL**: https://45.146.166.126:8071/admin/

### Keycloak Admin
- **Username**: admin  
- **Password**: aether_keycloak_admin_2025
- **URL**: https://45.146.166.126:8083/admin/

### MinIO
- **Access Key**: aether_minio
- **Secret Key**: aether_minio_password_2025
- **Console**: https://45.146.166.126:9001

### Тестовый пользователь
- **Username**: impress
- **Password**: impress

## 🔧 Управление сервисами

### Основные команды

```bash
# Просмотр логов всех сервисов
docker-compose -f compose-production.yml logs -f

# Просмотр логов конкретного сервиса
docker-compose -f compose-production.yml logs -f app-prod

# Перезапуск сервисов
docker-compose -f compose-production.yml restart

# Остановка всех сервисов
docker-compose -f compose-production.yml down

# Полная очистка (удаление данных)
docker-compose -f compose-production.yml down -v
```

### Обновление приложения

```bash
# 1. Получение обновлений
git pull origin main

# 2. Пересборка и перезапуск
docker-compose -f compose-production.yml up -d --build
```

## 🛠️ Диагностика проблем

### Проверка SSL сертификата

```bash
# Проверка сертификата
openssl s_client -connect 45.146.166.126:443 -servername yourdomain.com

# Проверка доступности HTTPS
curl -I https://45.146.166.126:3000
```

### Общие проблемы

1. **Сервисы не запускаются**
   ```bash
   docker-compose -f compose-production.yml logs
   ```

2. **SSL ошибки**
   - Проверьте установку сертификата
   - Убедитесь что веб-сервер корректно настроен

3. **CORS ошибки**
   - Проверьте `CORS_ALLOWED_ORIGINS` в конфигурации
   - Убедитесь что используются HTTPS URLs

4. **Ошибки подключения к базе данных**
   ```bash
   docker-compose -f compose-production.yml logs postgresql
   ```

### Логи по сервисам

```bash
# Backend
docker-compose -f compose-production.yml logs app-prod

# Frontend  
docker-compose -f compose-production.yml logs frontend-production

# Keycloak
docker-compose -f compose-production.yml logs keycloak

# Database
docker-compose -f compose-production.yml logs postgresql
```

## 📊 Мониторинг

### Проверка состояния

```bash
# Статус всех контейнеров
docker-compose -f compose-production.yml ps

# Использование ресурсов
docker stats

# Проверка дискового пространства
df -h
```

### Health Checks

```bash
# API Health
curl -k https://45.146.166.126:8071/api/v1.0/config/

# Frontend Health  
curl -I https://45.146.166.126:3000

# Keycloak Health
curl -k https://45.146.166.126:8083/health/ready
```

## 🔐 Безопасность

### Обязательные изменения для production

1. **Смените пароли по умолчанию**:
   - Django admin password
   - Keycloak admin password  
   - MinIO credentials
   - Database passwords

2. **Обновите секретные ключи**:
   - `DJANGO_SECRET_KEY`
   - `OIDC_RP_CLIENT_SECRET`
   - `COLLABORATION_SERVER_SECRET`

3. **Настройте SSL правильно**:
   - Используйте валидные SSL сертификаты
   - Настройте HSTS заголовки
   - Отключите HTTP доступ

### Рекомендации по безопасности

- Регулярно обновляйте все компоненты
- Используйте сильные пароли
- Настройте резервное копирование
- Мониторьте логи безопасности
- Ограничьте доступ к административным интерфейсам

## 📋 Контрольный список

- [ ] SSL сертификат установлен и настроен
- [ ] Все порты открыты в firewall
- [ ] Docker и Docker Compose установлены
- [ ] Переменные окружения настроены
- [ ] Пароли по умолчанию изменены
- [ ] Backup стратегия настроена
- [ ] Мониторинг настроен
- [ ] Логирование настроено

## 🎉 Заключение

После успешного развертывания Aether будет доступен через HTTPS со всеми необходимыми мерами безопасности. Обязательно протестируйте все функции перед использованием в production.

**Важно**: Никогда не используйте пароли по умолчанию в production окружении! 