#!/bin/bash

# Aether Production Deployment Script
# IP: 45.146.166.126
# Protocol: HTTP

echo "🚀 Запуск Aether в продакшн режиме на 45.146.166.126"
echo "================================================="

# Проверка требований
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Остановка development сервисов если запущены
echo "🛑 Остановка development сервисов..."
docker-compose down 2>/dev/null || true

# Очистка старых контейнеров и образов для production
echo "🧹 Очистка старых production контейнеров..."
docker-compose -f compose-production.yml down --remove-orphans 2>/dev/null || true

# Создание необходимых директорий
echo "📁 Создание директорий для данных..."
mkdir -p data/static
mkdir -p data/media

# Сборка и запуск production
echo "🏗️ Сборка и запуск production сервисов..."
docker-compose -f compose-production.yml up -d --build

# Ожидание запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 30

# Проверка статуса сервисов
echo "📊 Статус сервисов:"
docker-compose -f compose-production.yml ps

# Выполнение миграций базы данных
echo "🗄️ Выполнение миграций базы данных..."
docker-compose -f compose-production.yml exec app-prod python manage.py migrate

# Создание суперпользователя (опционально)
echo "👤 Создание суперпользователя (введите данные):"
docker-compose -f compose-production.yml exec app-prod python manage.py createsuperuser --noinput --username admin --email admin@aether.local || true

# Сбор статических файлов
echo "📦 Сбор статических файлов..."
docker-compose -f compose-production.yml exec app-prod python manage.py collectstatic --noinput

echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   Frontend:  http://45.146.166.126:3000"
echo "   Backend:   http://45.146.166.126:8071"
echo "   Keycloak:  http://45.146.166.126:8083"
echo "   MinIO:     http://45.146.166.126:9001"
echo ""
echo "🔑 Учетные данные по умолчанию:"
echo "   Keycloak Admin: admin / aether_keycloak_admin_2025"
echo "   MinIO:          aether_minio / aether_minio_password_2025"
echo ""
echo "📋 Полезные команды:"
echo "   Просмотр логов:     docker-compose -f compose-production.yml logs -f"
echo "   Остановка:          docker-compose -f compose-production.yml down"
echo "   Перезапуск:         docker-compose -f compose-production.yml restart"
echo ""
echo "🎉 Aether готов к использованию!" 