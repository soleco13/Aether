#!/bin/bash

# Скрипт автоматического деплоя Aether на продакшн сервер
# Использование: ./deploy.sh

set -e

echo "🚀 Начинаю деплой Aether на продакшн сервер..."

# Остановка существующих контейнеров
echo "⏹️  Остановка существующих контейнеров..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

# Очистка старых образов
echo "🧹 Очистка старых образов..."
docker system prune -f --volumes || true

# Создание директорий для SSL сертификатов
echo "📁 Создание директорий..."
mkdir -p ssl
mkdir -p data/static
mkdir -p data/media

# Проверка SSL сертификатов
if [ ! -f "ssl/aethers.ru.crt" ] || [ ! -f "ssl/aethers.ru.key" ]; then
    echo "⚠️  SSL сертификаты не найдены! Создание самоподписанных сертификатов..."
    
    # Создание самоподписанных сертификатов для тестирования
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/aethers.ru.key \
        -out ssl/aethers.ru.crt \
        -subj "/C=RU/ST=Moscow/L=Moscow/O=Aether/CN=aethers.ru"
    
    cp ssl/aethers.ru.crt ssl/aetherhelp.store.crt
    cp ssl/aethers.ru.key ssl/aetherhelp.store.key
    
    echo "✅ Самоподписанные сертификаты созданы"
fi

# Сборка и запуск контейнеров
echo "🔨 Сборка и запуск контейнеров..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Запуск сервисов..."
docker-compose -f docker-compose.prod.yml up -d

# Ожидание запуска базы данных
echo "⏳ Ожидание запуска базы данных..."
sleep 30

# Применение миграций
echo "🗄️  Применение миграций Django..."
docker-compose -f docker-compose.prod.yml exec -T app python manage.py migrate

# Сбор статических файлов
echo "📦 Сбор статических файлов..."
docker-compose -f docker-compose.prod.yml exec -T app python manage.py collectstatic --noinput

# Создание суперпользователя (если не существует)
echo "👤 Создание администратора..."
docker-compose -f docker-compose.prod.yml exec -T app python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@aethers.ru', 'admin123')
    print('Суперпользователь создан: admin/admin123')
else:
    print('Суперпользователь уже существует')
"

# Проверка статуса сервисов
echo "🔍 Проверка статуса сервисов..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "🌐 Сайт доступен по адресам:"
echo "   - https://aethers.ru (основной домен)"
echo "   - https://aetherhelp.store (редирект на основной)"
echo "   - http://45.146.166.126 (IP без SSL)"
echo ""
echo "🔑 Данные для входа:"
echo "   Администратор: admin / admin123"
echo ""
echo "📊 Мониторинг:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo "   docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "🛠️  Полезные команды:"
echo "   Обновление проекта: git pull && ./deploy.sh"
echo "   Остановка: docker-compose -f docker-compose.prod.yml down"
echo "   Перезапуск: docker-compose -f docker-compose.prod.yml restart"
echo "" 