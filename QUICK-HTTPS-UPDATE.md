# ⚡ Быстрое обновление Aether на HTTPS

## �� Что изменилось
Проект Aether обновлен для работы с HTTPS/SSL. Все HTTP URL заменены на HTTPS.

## 🔄 Команды для обновления
```bash
# 1. Получите обновления
git pull origin main

# 2. Остановите HTTP версию  
docker-compose -f compose-production-simple.yml down

# 3. Настройте SSL сертификат (пример)
sudo certbot --nginx -d yourdomain.com

# 4. Запустите HTTPS версию
./start-production.sh

# 5. Проверьте
curl -I https://45.146.166.126:3000
```

## 🌐 Новые HTTPS URLs
- Frontend: https://45.146.166.126:3000
- Backend: https://45.146.166.126:8071  
- Keycloak: https://45.146.166.126:8083
- MinIO: https://45.146.166.126:9001

## ⚠️ Требования
- SSL сертификат обязателен
- Обновите закладки на HTTPS URLs
- Настройте веб-сервер для HTTPS
