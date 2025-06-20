#!/bin/bash

# Aether Production Deployment Script (SSL/HTTPS Version)
# Этот скрипт развертывает полную production версию Aether с SSL поддержкой

echo "🚀 Запуск Aether Production с SSL поддержкой..."
echo "============================================="

# Проверка требований
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Остановка существующих контейнеров
echo "⏹️  Остановка существующих контейнеров..."
docker-compose -f compose-production.yml down

# Удаление старых образов для пересборки
echo "🗑️  Очистка старых образов..."
docker image prune -f

# Создание production образов
echo "🔨 Сборка production образов..."
docker-compose -f compose-production.yml build --no-cache

# Запуск всех сервисов
echo "🎯 Запуск всех сервисов..."
docker-compose -f compose-production.yml up -d

# Проверка статуса сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 30

echo "📊 Статус сервисов:"
docker-compose -f compose-production.yml ps

# Проверка backend
echo "🔍 Проверка backend сервиса..."
if curl -k -f https://45.146.166.126:8071/api/v1.0/config/ >/dev/null 2>&1; then
    echo "✅ Backend доступен"
else
    echo "❌ Backend не доступен. Проверьте логи:"
    echo "   docker-compose -f compose-production.yml logs app-prod"
fi

echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "🌐 Доступные сервисы (HTTPS):"
echo "   Frontend:  https://45.146.166.126:3000"
echo "   Backend:   https://45.146.166.126:8071"
echo "   Keycloak:  https://45.146.166.126:8083"
echo "   MinIO:     https://45.146.166.126:9001"
echo ""
echo "🔑 Учетные данные по умолчанию:"
echo "   Django Admin:   admin / admin"
echo "   Keycloak Admin: admin / aether_keycloak_admin_2025"
echo "   MinIO:          aether_minio / aether_minio_password_2025"
echo "   Тестовый пользователь: impress / impress"
echo ""
echo "⚠️  ВАЖНО: Убедитесь что на сервере настроен SSL сертификат!"
echo "          Без SSL сертификата сервисы не будут работать корректно."
echo ""
echo "📋 Полезные команды:"
echo "   Просмотр логов:     docker-compose -f compose-production.yml logs -f"
echo "   Остановка:          docker-compose -f compose-production.yml down"
echo "   Перезапуск:         docker-compose -f compose-production.yml restart"
echo ""
echo "🎉 Aether готов к использованию с SSL!" 