# 🚀 Деплой Aether на продакшн сервер

Инструкция по развертыванию проекта Aether на сервере `45.146.166.126` с доменами `aethers.ru` и `aetherhelp.store`.

## 📋 Требования

- Ubuntu/Debian сервер с root доступом
- Docker и Docker Compose
- Открытые порты: 80, 443, 8000, 3000
- Домены aethers.ru и aetherhelp.store направлены на IP 45.146.166.126

## 🛠️ Установка на чистый сервер

### 1. Подключение к серверу
```bash
ssh root@45.146.166.126
```

### 2. Установка Docker
```bash
# Обновление системы
apt update && apt upgrade -y

# Установка зависимостей
apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Добавление ключа Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавление репозитория Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Запуск Docker
systemctl start docker
systemctl enable docker

# Установка Docker Compose (старая версия для совместимости)
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 3. Установка Git
```bash
apt install -y git
```

## 📦 Деплой проекта

### 1. Клонирование репозитория
```bash
cd /root
git clone https://github.com/YOUR_USERNAME/aether-docs.git
cd aether-docs
```

### 2. Запуск деплоя
```bash
# Сделать скрипт исполняемым
chmod +x deploy.sh

# Запустить деплой
./deploy.sh
```

## 🌐 Проверка работы

После завершения деплоя проект будет доступен по адресам:

- **https://aethers.ru** - основной сайт
- **https://aetherhelp.store** - перенаправление на основной
- **http://45.146.166.126** - доступ по IP (без SSL)

### Данные для входа:
- **Логин**: admin
- **Пароль**: admin123

## 🔧 Управление проектом

### Просмотр логов
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Проверка статуса сервисов
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Перезапуск сервисов
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Остановка проекта
```bash
docker-compose -f docker-compose.prod.yml down
```

### Обновление проекта
```bash
git pull
./deploy.sh
```

## 🔐 SSL Сертификаты

Скрипт автоматически создает самоподписанные SSL сертификаты для тестирования.

Для продакшна рекомендуется использовать Let's Encrypt:

```bash
# Установка Certbot
apt install -y certbot

# Получение сертификатов
certbot certonly --standalone -d aethers.ru -d aetherhelp.store

# Копирование сертификатов
cp /etc/letsencrypt/live/aethers.ru/fullchain.pem ssl/aethers.ru.crt
cp /etc/letsencrypt/live/aethers.ru/privkey.pem ssl/aethers.ru.key
cp /etc/letsencrypt/live/aetherhelp.store/fullchain.pem ssl/aetherhelp.store.crt
cp /etc/letsencrypt/live/aetherhelp.store/privkey.pem ssl/aetherhelp.store.key

# Перезапуск Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 🗄️ База данных

### Бэкап базы данных
```bash
docker-compose -f docker-compose.prod.yml exec postgresql pg_dump -U aether aether > backup.sql
```

### Восстановление базы данных
```bash
docker-compose -f docker-compose.prod.yml exec -T postgresql psql -U aether aether < backup.sql
```

## 📊 Мониторинг

### Просмотр использования ресурсов
```bash
docker stats
```

### Просмотр места на диске
```bash
df -h
docker system df
```

## 🐛 Решение проблем

### Очистка Docker
```bash
# Остановка всех контейнеров
docker stop $(docker ps -aq)

# Удаление всех контейнеров
docker rm $(docker ps -aq)

# Очистка системы
docker system prune -a --volumes
```

### Перезапуск с нуля
```bash
./deploy.sh
```

## 📞 Поддержка

При возникновении проблем проверьте:

1. Логи сервисов: `docker-compose -f docker-compose.prod.yml logs`
2. Статус контейнеров: `docker-compose -f docker-compose.prod.yml ps`
3. Доступность портов: `netstat -tulpn | grep LISTEN`
4. DNS настройки доменов

## ⚡ Автоматическое обновление

Для автоматического обновления проекта можно настроить cron:

```bash
# Редактирование crontab
crontab -e

# Добавить строку для обновления каждую ночь в 3:00
0 3 * * * cd /root/aether-docs && git pull && ./deploy.sh >> /var/log/aether-deploy.log 2>&1
``` 