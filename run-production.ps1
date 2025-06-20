# Aether Production Deployment Script (SSL/HTTPS Version)
# Этот скрипт развертывает полную production версию Aether с SSL поддержкой

Write-Host "🚀 Запуск Aether Production с SSL поддержкой..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Остановка существующих контейнеров
Write-Host "⏹️  Остановка существующих контейнеров..." -ForegroundColor Yellow
docker-compose -f compose-production.yml down

# Удаление старых образов для пересборки
Write-Host "🗑️  Очистка старых образов..." -ForegroundColor Yellow
docker image prune -f

# Создание production образов
Write-Host "🔨 Сборка production образов..." -ForegroundColor Yellow
docker-compose -f compose-production.yml build --no-cache

# Запуск всех сервисов
Write-Host "🎯 Запуск всех сервисов..." -ForegroundColor Yellow
docker-compose -f compose-production.yml up -d

# Проверка статуса сервисов
Write-Host "⏳ Ожидание запуска сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "📊 Статус сервисов:" -ForegroundColor Cyan
docker-compose -f compose-production.yml ps

# Проверка backend
Write-Host "🔍 Проверка backend сервиса..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://45.146.166.126:8071/api/v1.0/config/" -SkipCertificateCheck -Method GET -TimeoutSec 10 | Out-Null
    Write-Host "✅ Backend доступен" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend не доступен. Проверьте логи:" -ForegroundColor Red
    Write-Host "   docker-compose -f compose-production.yml logs app-prod" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Развертывание завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Доступные сервисы (HTTPS):" -ForegroundColor Cyan
Write-Host "   Frontend:  https://45.146.166.126:3000" -ForegroundColor White
Write-Host "   Backend:   https://45.146.166.126:8071" -ForegroundColor White
Write-Host "   Keycloak:  https://45.146.166.126:8083" -ForegroundColor White
Write-Host "   MinIO:     https://45.146.166.126:9001" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Учетные данные по умолчанию:" -ForegroundColor Cyan
Write-Host "   Django Admin:   admin / admin" -ForegroundColor White
Write-Host "   Keycloak Admin: admin / aether_keycloak_admin_2025" -ForegroundColor White
Write-Host "   MinIO:          aether_minio / aether_minio_password_2025" -ForegroundColor White
Write-Host "   Тестовый пользователь: impress / impress" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  ВАЖНО: Убедитесь что на сервере настроен SSL сертификат!" -ForegroundColor Red
Write-Host "          Без SSL сертификата сервисы не будут работать корректно." -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Полезные команды:" -ForegroundColor Cyan
Write-Host "   Просмотр логов:     docker-compose -f compose-production.yml logs -f" -ForegroundColor White
Write-Host "   Остановка:          docker-compose -f compose-production.yml down" -ForegroundColor White
Write-Host "   Перезапуск:         docker-compose -f compose-production.yml restart" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Aether готов к использованию с SSL!" -ForegroundColor Green 