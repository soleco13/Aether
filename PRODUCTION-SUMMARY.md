# 🚀 Aether Production Summary (HTTPS/SSL Version)

## 📝 Краткое описание

Проект Aether полностью адаптирован для production развертывания с SSL поддержкой на IP `45.146.166.126` по протоколу HTTPS.

## 🛡️ SSL Конфигурация

### Требования
- **SSL сертификат** установлен и настроен на сервере
- **HTTPS порты** открыты в firewall (443, 3000, 8071, 8083, 9001)
- **Веб-сервер** (nginx/Apache) настроен для SSL терминации

## 🌐 Доступные сервисы (HTTPS)

| Сервис | URL | Назначение |
|--------|-----|------------|
| **Frontend** | https://45.146.166.126:3000 | Основное веб-приложение |
| **Backend** | https://45.146.166.126:8071 | Django REST API |
| **Keycloak** | https://45.146.166.126:8083 | Аутентификация и авторизация |
| **MinIO** | https://45.146.166.126:9001 | Файловое хранилище |

## 🔑 Учетные данные по умолчанию

```
Django Admin:   admin / admin
Keycloak Admin: admin / aether_keycloak_admin_2025  
MinIO:          aether_minio / aether_minio_password_2025
Тестовый пользователь: impress / impress
```

## 🚀 Быстрое развертывание

### Linux/macOS:
```bash
chmod +x start-production.sh
./start-production.sh
```

### Windows PowerShell:
```powershell
.\run-production.ps1
```

## 📋 Основные команды

```bash
# Запуск
docker-compose -f compose-production.yml up -d

# Просмотр логов
docker-compose -f compose-production.yml logs -f

# Остановка
docker-compose -f compose-production.yml down

# Статус сервисов
docker-compose -f compose-production.yml ps
```

## 🔧 Структура проекта

```
├── compose-production.yml        # Основной Docker Compose (SSL)
├── compose-production-simple.yml # Альтернативный compose (SSL)
├── env.d/production/            # Переменные окружения (HTTPS)
├── docker/auth/realm.json       # Keycloak конфигурация (HTTPS)
├── start-production.sh          # Bash скрипт развертывания
├── run-production.ps1           # PowerShell скрипт развертывания
└── PRODUCTION-DEPLOYMENT.md     # Подробная документация
```

## 🛡️ Безопасность (SSL)

### Включенные настройки:
- `SECURE_SSL_REDIRECT=True` - принудительное перенаправление на HTTPS
- `SESSION_COOKIE_SECURE=True` - безопасные cookies
- `CSRF_COOKIE_SECURE=True` - безопасные CSRF токены
- `SECURE_HSTS_SECONDS=31536000` - HSTS заголовки
- CORS настроен для HTTPS origins

### Обязательные изменения:
⚠️ **Смените пароли по умолчанию** перед production использованием!

## 🔍 Диагностика

### Проверка SSL:
```bash
# Проверка сертификата
openssl s_client -connect 45.146.166.126:443

# Проверка HTTPS доступности
curl -I https://45.146.166.126:3000
curl -k https://45.146.166.126:8071/api/v1.0/config/
```

### Проверка сервисов:
```bash
# Health checks
curl -k https://45.146.166.126:8071/api/v1.0/config/
curl -I https://45.146.166.126:3000
curl -k https://45.146.166.126:8083/health/ready
```

## 📊 Мониторинг

```bash
# Статус контейнеров
docker-compose -f compose-production.yml ps

# Использование ресурсов
docker stats

# Логи всех сервисов
docker-compose -f compose-production.yml logs -f
```

## ⚠️ Важные замечания

1. **SSL сертификат обязателен** - без него сервисы не будут работать
2. **Все URLs используют HTTPS** - HTTP трафик перенаправляется
3. **WebSocket соединения** используют WSS (secure WebSocket)
4. **Mixed content блокируется** - все ресурсы должны быть HTTPS

## 🎉 Статус готовности

✅ **Готово к production** с SSL поддержкой!

Проект полностью настроен для безопасного развертывания в production окружении с использованием HTTPS протокола и современных стандартов безопасности. 