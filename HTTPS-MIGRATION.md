# 🔐 Aether HTTPS Migration Guide

## 📋 Обзор

Проект Aether был полностью адаптирован для работы с HTTPS/SSL. Все HTTP URL были заменены на HTTPS, добавлены настройки безопасности Django и обновлены конфигурации всех сервисов.

## 🔄 Выполненные изменения

### 1. Django Configuration (env.d/production/common)

**SSL Security Settings:**
```bash
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True  
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https")
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_PRELOAD=True
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
```

**URLs updated to HTTPS:**
```bash
IMPRESS_BASE_URL="https://45.146.166.126:8071"
LOGIN_REDIRECT_URL=https://45.146.166.126:3000
CORS_ALLOWED_ORIGINS=["https://45.146.166.126:3000"]
COLLABORATION_WS_URL=wss://45.146.166.126:4444/collaboration/ws/
```

### 2. Docker Compose Files

Both `compose-production.yml` and `compose-production-simple.yml` updated:
```yaml
environment:
  - NEXT_PUBLIC_API_ORIGIN=https://45.146.166.126:8071
args:
  API_ORIGIN: "https://45.146.166.126:8071"
  NEXT_PUBLIC_API_ORIGIN: "https://45.146.166.126:8071"
```

### 3. Keycloak Configuration

**Command parameters:**
```yaml
- --hostname-url=https://45.146.166.126:8083
- --hostname-admin-url=https://45.146.166.126:8083/
```

**Realm configuration (docker/auth/realm.json):**
```json
"redirectUris": ["https://45.146.166.126:3000/*"],
"webOrigins": ["https://45.146.166.126:3000"]
```

### 4. Deployment Scripts

**start-production.sh:**
- All URLs updated to HTTPS
- Added SSL certificate warnings
- Updated health check to use `curl -k` for HTTPS

**run-production.ps1:**
- All URLs updated to HTTPS
- Added `-SkipCertificateCheck` for PowerShell web requests
- Added SSL requirement warnings

## 🛡️ SSL Requirements

### Before Deployment:
1. **SSL Certificate** must be installed on server
2. **Web server** (nginx/Apache) configured for HTTPS
3. **Firewall ports** open for HTTPS traffic

### Verification Commands:
```bash
# Check SSL certificate
openssl s_client -connect 45.146.166.126:443

# Test HTTPS endpoints  
curl -I https://45.146.166.126:3000
curl -k https://45.146.166.126:8071/api/v1.0/config/
```

## 🌐 Updated Service URLs

| Service | HTTPS URL |
|---------|-----------|
| Frontend | https://45.146.166.126:3000 |
| Backend | https://45.146.166.126:8071 |
| Keycloak | https://45.146.166.126:8083 |
| MinIO | https://45.146.166.126:9001 |

## ⚠️ Important Notes

- **SSL certificate is required** for proper operation
- All services now enforce HTTPS redirects
- Mixed content (HTTP resources) will be blocked
- WebSocket connections use WSS (secure WebSocket)

## 🎉 Benefits

- **Enhanced Security**: All traffic encrypted
- **CORS Policy**: Proper cross-origin handling
- **HSTS**: Protection against downgrade attacks
- **Production Ready**: Industry-standard security practices 