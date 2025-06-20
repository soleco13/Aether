# Aether Production Deployment Script for Windows PowerShell
# Target: 45.146.166.126:3000 (HTTP)

Write-Host "🚀 Запуск Aether в продакшн режиме" -ForegroundColor Green
Write-Host "IP: 45.146.166.126 | Protocol: HTTP" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Green

# Проверка Docker
Write-Host "🔍 Проверка Docker..."
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker найден" -ForegroundColor Green
} else {
    Write-Host "❌ Docker не найден. Установите Docker Desktop" -ForegroundColor Red
    exit 1
}

# Проверка Docker Compose
Write-Host "🔍 Проверка Docker Compose..."
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker Compose найден" -ForegroundColor Green
} else {
    Write-Host "❌ Docker Compose не найден" -ForegroundColor Red
    exit 1
}

# Остановка dev сервисов
Write-Host "`n🛑 Остановка development сервисов..."
docker-compose down --remove-orphans 2>$null

# Остановка production сервисов
Write-Host "🛑 Остановка старых production сервисов..."
docker-compose -f compose-production.yml down --remove-orphans 2>$null

# Создание директорий
Write-Host "`n📁 Создание директорий..."
New-Item -ItemType Directory -Force -Path "data", "data/static", "data/media" | Out-Null

# Запуск production
Write-Host "`n🏗️ Сборка и запуск production..."
docker-compose -f compose-production.yml up -d --build

Write-Host "`n⏳ Ожидание запуска сервисов..."
Start-Sleep 30

Write-Host "`n📊 Статус сервисов:"
docker-compose -f compose-production.yml ps

Write-Host "`n🗄️ Миграции базы данных..."
docker-compose -f compose-production.yml exec -T app-prod python manage.py migrate

Write-Host "`n📦 Сбор статических файлов..."
docker-compose -f compose-production.yml exec -T app-prod python manage.py collectstatic --noinput

Write-Host "`n" -NoNewline
Write-Host "✅ РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!" -ForegroundColor Green
Write-Host "`n🌐 Сервисы доступны по адресам:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://45.146.166.126:3000" -ForegroundColor White
Write-Host "   Backend:   http://45.146.166.126:8071" -ForegroundColor White  
Write-Host "   Keycloak:  http://45.146.166.126:8083" -ForegroundColor White
Write-Host "   MinIO:     http://45.146.166.126:9001" -ForegroundColor White

Write-Host "`n🔑 Учетные данные:" -ForegroundColor Cyan
Write-Host "   Keycloak: admin / aether_keycloak_admin_2025" -ForegroundColor White
Write-Host "   MinIO: aether_minio / aether_minio_password_2025" -ForegroundColor White

Write-Host "`n🎉 Aether готов к использованию!" -ForegroundColor Green 