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

# Выбор compose файла
COMPOSE_FILE="compose-production.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "⚠️ Основной compose файл не найден, использую альтернативный..."
    COMPOSE_FILE="compose-production-simple.yml"
fi

echo "📋 Используется файл: $COMPOSE_FILE"

# Сборка и запуск production
echo "🏗️ Сборка и запуск production сервисов..."
docker-compose -f $COMPOSE_FILE up -d --build

if [ $? -eq 0 ]; then
    echo "✅ Сборка завершена успешно!"
else
    echo "❌ Ошибка при сборке. Пробуем альтернативный файл..."
    COMPOSE_FILE="compose-production-simple.yml"
    docker-compose -f $COMPOSE_FILE up -d --build
fi

# Ожидание запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 30

# Проверка статуса сервисов
echo "📊 Статус сервисов:"
docker-compose -f $COMPOSE_FILE ps

# Проверка запуска backend
echo "🔍 Проверка backend сервиса..."
if docker-compose -f $COMPOSE_FILE ps | grep -q "app-prod.*Up"; then
    echo "✅ Backend запущен"
    
    # Выполнение миграций базы данных
    echo "🗄️ Выполнение миграций базы данных..."
    docker-compose -f $COMPOSE_FILE exec -T app-prod python manage.py migrate
    
    # Сбор статических файлов
    echo "📦 Сбор статических файлов..."
    docker-compose -f $COMPOSE_FILE exec -T app-prod python manage.py collectstatic --noinput
    
    # Создание суперпользователя (опционально)
    echo "👤 Создание суперпользователя admin с паролем admin..."
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@aether.local', 'admin')" | docker-compose -f $COMPOSE_FILE exec -T app-prod python manage.py shell
else
    echo "❌ Backend не запущен. Проверьте логи:"
    docker-compose -f $COMPOSE_FILE logs app-prod
fi

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
echo "   Django Admin:   admin / admin"
echo "   Keycloak Admin: admin / aether_keycloak_admin_2025"
echo "   MinIO:          aether_minio / aether_minio_password_2025"
echo "   Тестовый пользователь: impress / impress"
echo ""
echo "📋 Полезные команды:"
echo "   Просмотр логов:     docker-compose -f $COMPOSE_FILE logs -f"
echo "   Остановка:          docker-compose -f $COMPOSE_FILE down"
echo "   Перезапуск:         docker-compose -f $COMPOSE_FILE restart"
echo ""
echo "🎉 Aether готов к использованию!" 