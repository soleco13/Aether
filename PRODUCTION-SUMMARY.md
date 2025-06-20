# 🚀 Aether Production Setup - Краткое резюме

## ✅ Подготовленные изменения

Ваш проект Aether готов для продакшн развертывания на `45.146.166.126` с HTTP протоколом.

### 📁 Созданные файлы

1. **`compose-production.yml`** - Docker Compose для продакшна
2. **`env.d/production/common`** - Переменные окружения Django
3. **`env.d/production/postgresql`** - Настройки PostgreSQL
4. **`env.d/production/kc_postgresql`** - Настройки PostgreSQL для Keycloak
5. **`run-production.ps1`** - PowerShell скрипт запуска (Windows)
6. **`start-production.sh`** - Bash скрипт запуска (Linux/macOS)
7. **`PRODUCTION-DEPLOYMENT.md`** - Подробная документация

### 🔧 Обновленные файлы

1. **`docker/files/etc/nginx/conf.d/default.conf`** - Nginx для продакшна
2. **`docker/auth/realm.json`** - Keycloak настройки для нового IP
3. **`src/frontend/apps/impress/src/api/config.ts`** - API конфигурация

## 🚀 Команды для запуска

### Для Windows:
```powershell
.\run-production.ps1
```

### Для Linux/macOS:
```bash
chmod +x start-production.sh
./start-production.sh
```

### Ручной запуск:
```bash
docker-compose -f compose-production.yml up -d --build
```

## 🌐 Доступные сервисы после запуска

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | http://45.146.166.126:3000 | Главная страница Aether |
| **Backend** | http://45.146.166.126:8071 | Django API |
| **Keycloak** | http://45.146.166.126:8083 | Система аутентификации |
| **MinIO** | http://45.146.166.126:9001 | Файловое хранилище |

## 🔑 Учетные данные

- **Keycloak Admin**: `admin` / `aether_keycloak_admin_2025`
- **MinIO**: `aether_minio` / `aether_minio_password_2025`
- **Тестовый пользователь**: `impress` / `impress`

## ⚠️ Важные настройки

### Конфигурация для HTTP (без SSL):
- `SECURE_SSL_REDIRECT=False`
- `SESSION_COOKIE_SECURE=False`
- `CSRF_COOKIE_SECURE=False`

### IP и домены:
- Allowed Hosts: `45.146.166.126, localhost`
- API Origin: `http://45.146.166.126:8071`
- Frontend URL: `http://45.146.166.126:3000`

## 🛡️ Безопасность

⚠️ **ВАЖНО**: Перед продакшн развертыванием измените пароли в:
- `env.d/production/common`
- `env.d/production/postgresql`
- `env.d/production/kc_postgresql`

## 📋 Следующие шаги

1. **Загрузите проект на сервер** `45.146.166.126`
2. **Установите Docker и Docker Compose**
3. **Запустите скрипт развертывания**
4. **Проверьте доступность сервисов**
5. **Измените пароли для безопасности**

---

**Проект готов к продакшн развертыванию! 🎉** 