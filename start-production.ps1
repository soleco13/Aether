# Aether Production Deployment Script for Windows
# IP: 45.146.166.126
# Protocol: HTTP

Write-Host "🚀 Запуск Aether в продакшн режиме на 45.146.166.126" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Проверка требований
Write-Host "🔍 Проверка требований..."

try {
    docker --version | Out-Null
    Write-Host "✅ Docker установлен" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker не установлен. Установите Docker Desktop и попробуйте снова." -ForegroundColor Red
    exit 1
}

try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose установлен" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова." -ForegroundColor Red
    exit 1
}

# Остановка development сервисов если запущены
Write-Host "🛑 Остановка development сервисов..."
docker-compose down 2>$null

# Очистка старых контейнеров для production
Write-Host "🧹 Очистка старых production контейнеров..."
docker-compose -f compose-production.yml down --remove-orphans 2>$null

# Создание необходимых директорий
Write-Host "📁 Создание директорий для данных..."
if (!(Test-Path "data")) { New-Item -ItemType Directory -Path "data" }
if (!(Test-Path "data/static")) { New-Item -ItemType Directory -Path "data/static" }
if (!(Test-Path "data/media")) { New-Item -ItemType Directory -Path "data/media" }

# Сборка и запуск production
Write-Host "🏗️ Сборка и запуск production сервисов..."
docker-compose -f compose-production.yml up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Сервисы запущены успешно!" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка при запуске сервисов" -ForegroundColor Red
    exit 1
}

# Ожидание запуска сервисов
Write-Host "⏳ Ожидание запуска сервисов (30 секунд)..."
Start-Sleep -Seconds 30

# Проверка статуса сервисов
Write-Host "📊 Статус сервисов:"
docker-compose -f compose-production.yml ps

# Выполнение миграций базы данных
Write-Host "🗄️ Выполнение миграций базы данных..."
docker-compose -f compose-production.yml exec -T app-prod python manage.py migrate

# Сбор статических файлов
Write-Host "📦 Сбор статических файлов..."
docker-compose -f compose-production.yml exec -T app-prod python manage.py collectstatic --noinput

Write-Host ""
Write-Host "✅ Развертывание завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Доступные сервисы:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://45.146.166.126:3000" -ForegroundColor White
Write-Host "   Backend:   http://45.146.166.126:8071" -ForegroundColor White
Write-Host "   Keycloak:  http://45.146.166.126:8083" -ForegroundColor White
Write-Host "   MinIO:     http://45.146.166.126:9001" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Учетные данные по умолчанию:" -ForegroundColor Cyan
Write-Host "   Keycloak Admin: admin / aether_keycloak_admin_2025" -ForegroundColor White
Write-Host "   MinIO:          aether_minio / aether_minio_password_2025" -ForegroundColor White
Write-Host ""
Write-Host "📋 Полезные команды:" -ForegroundColor Cyan
Write-Host "   Просмотр логов:     docker-compose -f compose-production.yml logs -f" -ForegroundColor White
Write-Host "   Остановка:          docker-compose -f compose-production.yml down" -ForegroundColor White
Write-Host "   Перезапуск:         docker-compose -f compose-production.yml restart" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Aether готов к использованию!" -ForegroundColor Green 