# 🚀 Инструкция по деплою Aether Docs

## Подготовка к деплою

### 1. Настройка доменов
Убедитесь, что домены `aethers.ru` и `aetherhelp.store` указывают на ваш сервер `45.146.166.126`.

### 2. Установка SSL-сертификатов
На сервере установите Let's Encrypt сертификаты:

```bash
# Установка Certbot
sudo apt update
sudo apt install certbot

# Получение сертификатов
sudo certbot certonly --standalone -d aethers.ru
sudo certbot certonly --standalone -d aetherhelp.store

# Настройка автообновления
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Настройка переменных окружения
Отредактируйте файл `env.d/production/common` и замените:

- `DJANGO_SECRET_KEY` - на уникальный секретный ключ Django
- `POSTGRES_PASSWORD` - на безопасный пароль для базы данных
- `KEYCLOAK_ADMIN_PASSWORD` - на пароль администратора Keycloak

**⚠️ ВАЖНО:** Используйте сильные пароли для продакшена!

### 4. Настройка сервера

На сервере должны быть установлены:
- Docker
- Docker Compose
- Git

```bash
# Установка Docker на Ubuntu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Деплой

### Способ 1: Автоматический деплой (рекомендуется)

```bash
# Клонирование репозитория на сервер
git clone https://github.com/ваш-юзер/aether-docs.git
cd aether-docs

# Настройка переменных окружения
nano env.d/production/common

# Запуск деплоя
chmod +x deploy.sh
./deploy.sh
```

### Способ 2: Ручной деплой

```bash
# Остановка старых контейнеров
docker-compose -f docker-compose.prod.yml down

# Сборка новых образов
docker-compose -f docker-compose.prod.yml build

# Запуск
docker-compose -f docker-compose.prod.yml --env-file ./env.d/production/common up -d

# Миграции
docker-compose -f docker-compose.prod.yml exec app python manage.py migrate

# Статические файлы
docker-compose -f docker-compose.prod.yml exec app python manage.py collectstatic --noinput

# Создание суперпользователя
docker-compose -f docker-compose.prod.yml exec app python manage.py createsuperuser
```

## После деплоя

### Проверка работы
1. Откройте https://aethers.ru - должна загрузиться главная страница
2. Перейдите на https://aethers.ru/admin/ - панель Django admin
3. Проверьте https://aethers.ru/auth/ - Keycloak аутентификация

### Настройка Keycloak
1. Войдите в админку Keycloak: https://aethers.ru/auth/admin/
2. Логин: `admin`, пароль из переменной `KEYCLOAK_ADMIN_PASSWORD`
3. Настройте realm согласно вашим требованиям

### Мониторинг

```bash
# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Перезапуск сервиса
docker-compose -f docker-compose.prod.yml restart app
```

## Обновление

```bash
# Получение последних изменений
git pull origin main

# Пересборка и перезапуск
./deploy.sh
```

## Резервное копирование

```bash
# Создание бэкапа базы данных
docker-compose -f docker-compose.prod.yml exec postgresql pg_dump -U impress impress > backup_$(date +%Y%m%d_%H%M%S).sql

# Бэкап медиа файлов
tar -czf media_backup_$(date +%Y%m%d_%H%M%S).tar.gz data/media/
```

## Troubleshooting

### Проблемы с SSL
- Убедитесь, что сертификаты Let's Encrypt установлены
- Проверьте права доступа к файлам сертификатов

### Проблемы с базой данных
- Проверьте, что PostgreSQL контейнер запущен
- Убедитесь в правильности переменных окружения

### Проблемы с Keycloak
- Проверьте настройки домена в конфигурации
- Убедитесь, что база данных доступна для Keycloak

## Контакты
Если возникли проблемы, обратитесь к документации или создайте issue в репозитории. 