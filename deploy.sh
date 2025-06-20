#!/bin/bash

# Aether Docs Production Deployment Script
# Скрипт для деплоя на сервер 45.146.166.126

set -e

echo "🚀 Запуск деплоя Aether Docs..."

# Проверка существования файла переменных окружения
if [ ! -f "./env.d/production/common" ]; then
    echo "❌ Файл env.d/production/common не найден!"
    echo "Создайте файл с переменными окружения перед деплоем."
    exit 1
fi

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен!"
    exit 1
fi

echo "✅ Проверки пройдены"

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

# Удаление старых образов
echo "🗑️ Очистка старых образов..."
docker system prune -f

# Сборка образов
echo "🔨 Сборка образов..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запуск контейнеров
echo "▶️ Запуск контейнеров..."
docker-compose -f docker-compose.prod.yml --env-file ./env.d/production/common up -d

# Ожидание готовности базы данных
echo "⏳ Ожидание готовности базы данных..."
sleep 30

# Выполнение миграций Django
echo "🔄 Выполнение миграций..."
docker-compose -f docker-compose.prod.yml exec -T app python manage.py migrate

# Сбор статических файлов Django
echo "📦 Сбор статических файлов..."
docker-compose -f docker-compose.prod.yml exec -T app python manage.py collectstatic --noinput

# Создание суперпользователя (если нужно)
echo "👤 Создание суперпользователя..."
docker-compose -f docker-compose.prod.yml exec -T app python manage.py createsuperuser --noinput --username admin --email admin@aethers.ru || echo "Суперпользователь уже существует"

# Проверка статуса
echo "🔍 Проверка статуса контейнеров..."
docker-compose -f docker-compose.prod.yml ps

echo "✅ Деплой завершен!"
echo ""
echo "🌐 Ваш сайт доступен по адресам:"
echo "   - https://aethers.ru"
echo "   - https://aetherhelp.store (редирект на основной)"
echo ""
echo "🔧 Панель администратора Django:"
echo "   - https://aethers.ru/admin/"
echo ""
echo "🔐 Keycloak админка:"
echo "   - https://aethers.ru/auth/admin/"
echo ""
echo "📊 Логи можно посмотреть командой:"
echo "   docker-compose -f docker-compose.prod.yml logs -f" 