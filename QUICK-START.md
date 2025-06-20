# 🚀 Быстрый запуск Aether Docs

## Подготовка к деплою

### 1. Настройте секреты
```bash
# Скопируйте пример файла
cp env.d/production/common.example env.d/production/common

# Отредактируйте файл и замените все значения
nano env.d/production/common
```

**⚠️ ОБЯЗАТЕЛЬНО ЗАМЕНИТЕ:**
- `DJANGO_SECRET_KEY` - сгенерируйте: `python -c "import secrets; print(secrets.token_urlsafe(50))"`
- `POSTGRES_PASSWORD` - сильный пароль для БД
- `KEYCLOAK_ADMIN_PASSWORD` - пароль для админки Keycloak
- `OIDC_RP_CLIENT_SECRET` - секрет клиента из Keycloak

### 2. DNS записи
Убедитесь, что домены указывают на ваш сервер:
```
aethers.ru -> 45.146.166.126
aetherhelp.store -> 45.146.166.126
```

### 3. SSL сертификаты
```bash
# На сервере
sudo apt install certbot
sudo certbot certonly --standalone -d aethers.ru
sudo certbot certonly --standalone -d aetherhelp.store
```

## Деплой

### Автоматический деплой
```bash
./deploy.sh
```

### Ручной деплой
```bash
docker-compose -f docker-compose.prod.yml --env-file ./env.d/production/common up -d
```

## После деплоя

- 🌐 Сайт: https://aethers.ru
- 🔧 Django Admin: https://aethers.ru/admin/
- 🔐 Keycloak: https://aethers.ru/auth/admin/

## Логи
```bash
docker-compose -f docker-compose.prod.yml logs -f
``` 