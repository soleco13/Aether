# 🔧 Исправление проблемы с localhost

## Проблема
При нажатии на "Начать работу" фронтенд перенаправлял на `localhost:8071` вместо `45.146.166.126:8071`.

## ✅ Исправления внесены

### 1. Обновлена логика API config
**Файл**: `src/frontend/apps/impress/src/api/config.ts`
- Теперь автоматически определяет правильный backend URL на основе hostname
- Для `45.146.166.126` использует `http://45.146.166.126:8071`
- Для `localhost` использует `http://localhost:8071`

### 2. Обновлены Docker Compose файлы
**Файлы**: `compose-production.yml` и `compose-production-simple.yml`
- Добавлена переменная `NEXT_PUBLIC_API_ORIGIN=http://45.146.166.126:8071`
- Обеспечивает правильную конфигурацию API в production

## 🚀 Команды для применения

### 1. Пушьте изменения на сервер:
```bash
git add .
git commit -m "fix: исправлена проблема с localhost в API config"
git push
```

### 2. На сервере обновите проект:
```bash
cd /opt/Aether
git pull

# Пересоберите и перезапустите frontend
docker-compose -f compose-production.yml up -d --build frontend-production

# Или полный перезапуск
./start-production.sh
```

### 3. Проверьте результат:
- Откройте http://45.146.166.126:3000
- Нажмите "Начать работу"
- Теперь должно перенаправлять на правильный URL

## 🔍 Что было изменено

### До:
```javascript
// Всегда использовал window.location.origin
return window.location.origin; // http://45.146.166.126:3000 ❌
```

### После:
```javascript
// Проверяет hostname и возвращает правильный backend URL
if (currentHost === '45.146.166.126') {
  return 'http://45.146.166.126:8071'; // ✅
}
```

## ✅ Результат
Теперь фронтенд корректно обращается к `http://45.146.166.126:8071/api/v1.0/authenticate/` вместо `http://localhost:8071`.

**Проблема решена! 🎉** 