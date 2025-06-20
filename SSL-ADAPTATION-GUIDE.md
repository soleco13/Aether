# 🔐 Aether SSL Adaptation Guide

Это руководство описывает изменения, внесенные в проект Aether для поддержки SSL/HTTPS.

## 📋 Обзор изменений

Проект был полностью адаптирован для работы с HTTPS, включая:
- Обновление всех URL с HTTP на HTTPS
- Настройка SSL параметров безопасности Django
- Обновление CORS политик для HTTPS
- Изменение конфигурации Keycloak для SSL
- Обновление скриптов развертывания

## 🔄 Основные изменения файлов

### 1. Django Configuration (`env.d/production/common`)

**Изменения безопасности:**
```bash
# Было (HTTP):
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
SECURE_SSL_REDIRECT=False

# Стало (HTTPS):
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https")
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_PRELOAD=True
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
```

**Обновление URLs:**
```bash
# Было:
IMPRESS_BASE_URL="http://45.146.166.126:8071"
LOGIN_REDIRECT_URL=http://45.146.166.126:3000
CORS_ALLOWED_ORIGINS=["http://45.146.166.126:3000"]

# Стало:
IMPRESS_BASE_URL="https://45.146.166.126:8071"
LOGIN_REDIRECT_URL=https://45.146.166.126:3000
CORS_ALLOWED_ORIGINS=["https://45.146.166.126:3000"]
```

### 2. Docker Compose Files

**Frontend Environment:**
```yaml
# compose-production.yml и compose-production-simple.yml
environment:
  - NEXT_PUBLIC_API_ORIGIN=https://45.146.166.126:8071  # было http://
```

**Build Args:**
```yaml
args:
  API_ORIGIN: "https://45.146.166.126:8071"             # было http://
  NEXT_PUBLIC_API_ORIGIN: "https://45.146.166.126:8071" # было http://
```

### 3. Keycloak Configuration

**Hostname Settings:**
```yaml
command:
  - --hostname-url=https://45.146.166.126:8083      # было http://
  - --hostname-admin-url=https://45.146.166.126:8083/ # было http://
```

**Realm Configuration (`docker/auth/realm.json`):**
```json
"redirectUris": [
  "https://45.146.166.126:3000/*"   // было http://
],
"webOrigins": [
  "https://45.146.166.126:3000"     // было http://
]
```

### 4. Deployment Scripts

**Bash Script (`start-production.sh`):**
- Обновлены все URL на HTTPS
- Добавлено предупреждение о необходимости SSL сертификата
- Изменена проверка backend с curl -k для HTTPS

**PowerShell Script (`run-production.ps1`):**
- Обновлены все URL на HTTPS  
- Добавлена проверка HTTPS с `-SkipCertificateCheck`
- Добавлены предупреждения о SSL требованиях

## 🛠️ Требования для развертывания

### Обязательные требования

1. **SSL Сертификат**
   - Установлен на сервере
   - Корректно настроен для домена/IP
   - Доверенный (не self-signed для production)

2. **Веб-сервер (Nginx/Apache)**
   - Настроен для проксирования HTTPS трафика
   - SSL терминация настроена
   - Перенаправление HTTP → HTTPS

3. **Firewall Configuration**
   - Порт 443 открыт для HTTPS
   - Порт 80 может быть закрыт (опционально)

### Пример конфигурации Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name 45.146.166.126;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8071;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
    
    # Keycloak
    location /auth/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name 45.146.166.126;
    return 301 https://$server_name$request_uri;
}
```

## 🔧 Процесс миграции с HTTP на HTTPS

### Шаг 1: Остановка HTTP версии
```bash
docker-compose -f compose-production.yml down
```

### Шаг 2: Установка SSL сертификата
```bash
# С Let's Encrypt
sudo certbot --nginx -d yourdomain.com

# Или установка собственного сертификата
sudo cp certificate.crt /etc/ssl/certs/
sudo cp private.key /etc/ssl/private/
```

### Шаг 3: Запуск HTTPS версии
```bash
./start-production.sh
```

### Шаг 4: Проверка работоспособности
```bash
# Проверка SSL
curl -I https://45.146.166.126:3000

# Проверка API
curl -k https://45.146.166.126:8071/api/v1.0/config/

# Проверка Keycloak
curl -k https://45.146.166.126:8083/health/ready
```

## 🔍 Диагностика SSL проблем

### Частые проблемы и решения

1. **Certificate not trusted**
   ```bash
   # Проверка сертификата
   openssl s_client -connect 45.146.166.126:443 -servername yourdomain.com
   ```

2. **CORS errors after SSL migration**
   - Убедитесь что `CORS_ALLOWED_ORIGINS` содержит HTTPS URLs
   - Проверьте `CSRF_TRUSTED_ORIGINS` настройки

3. **Mixed content warnings**
   - Все ресурсы должны загружаться через HTTPS
   - Проверьте логи браузера на HTTP ресурсы

4. **Keycloak redirect issues**
   - Убедитесь что все redirect URLs в realm.json используют HTTPS
   - Проверьте hostname настройки Keycloak

### Команды для диагностики

```bash
# Проверка SSL сертификата
openssl x509 -in /path/to/certificate.crt -text -noout

# Проверка SSL соединения
curl -vI https://45.146.166.126:3000

# Проверка HSTS заголовков
curl -I https://45.146.166.126:3000 | grep -i strict

# Проверка логов SSL
docker-compose -f compose-production.yml logs nginx
```

## ⚠️ Важные замечания

### Безопасность

1. **Обязательно смените пароли** после миграции на HTTPS
2. **Включите HSTS** для предотвращения downgrade атак
3. **Используйте strong ciphers** в SSL конфигурации
4. **Настройте автоматическое обновление** сертификатов

### Production рекомендации

1. **Мониторинг сертификатов**
   - Настройте уведомления об истечении
   - Автоматическое обновление Let's Encrypt

2. **Backup SSL ключей**
   - Храните приватные ключи в безопасности
   - Регулярно создавайте резервные копии

3. **Тестирование**
   - Проверьте все функции после миграции
   - Убедитесь что WebSocket соединения работают
   - Протестируйте аутентификацию

## 📋 Checklist для SSL адаптации

- [ ] SSL сертификат установлен и настроен
- [ ] Nginx/Apache настроен для HTTPS
- [ ] Все HTTP URLs заменены на HTTPS
- [ ] CORS настройки обновлены для HTTPS
- [ ] Keycloak realm настроен для HTTPS
- [ ] Docker Compose файлы обновлены
- [ ] Скрипты развертывания обновлены
- [ ] SSL security settings включены в Django
- [ ] Проведено тестирование всех функций
- [ ] Мониторинг SSL настроен

## 🎉 Заключение

После успешной адаптации проект Aether будет полностью работать по HTTPS протоколу со всеми необходимыми мерами безопасности. 

**Важно**: Убедитесь что SSL сертификат корректно установлен и настроен перед запуском production версии! 