# Инструкция по настройке QuickCart

## Быстрый старт

1. **Установите зависимости:**
```bash
npm install
```

2. **Создайте файл `.env.local`:**
```bash
cp .env.example .env.local
```

3. **Настройте переменные окружения:**

### NextAuth
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
```
Для генерации секрета: `openssl rand -base64 32`

### Mapbox
1. Зарегистрируйтесь на [mapbox.com](https://www.mapbox.com)
2. Создайте access token
3. Добавьте в `.env.local`:
```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoi...
```

### Stripe (опционально, для тестирования оплаты)
1. Зарегистрируйтесь на [stripe.com](https://stripe.com)
2. Получите test keys из Dashboard
3. Добавьте в `.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

4. **Создайте PWA иконки:**
   - Создайте `icon-192.png` (192x192px)
   - Создайте `icon-512.png` (512x512px)
   - Поместите их в папку `/public`

   Можно использовать онлайн генератор: https://realfavicongenerator.net/

5. **Запустите dev сервер:**
```bash
npm run dev
```

6. **Откройте браузер:**
```
http://localhost:3000
```

## Тестирование

### Авторизация
- Любой email и пароль работают (mock authentication)
- После входа пользователь сохраняется в localStorage

### Оплата (если настроен Stripe)
Используйте тестовые карты:
- Успешная оплата: `4242 4242 4242 4242`
- Любая дата в будущем (например, 12/25)
- Любой CVC (например, 123)

### Карта
- Если Mapbox token не настроен, карта будет использовать fallback token (ограниченный)
- Для production обязательно получите свой token

## Структура проекта

```
QuickCart/
├── app/                    # Next.js App Router страницы
│   ├── page.tsx           # Landing страница
│   ├── map/               # Страница карты
│   ├── store/[id]/        # Страница магазина
│   ├── cart/              # Корзина
│   ├── checkout/          # Оформление заказа
│   └── tracking/[id]/     # Отслеживание заказа
├── components/            # React компоненты
│   ├── ui/               # Shadcn/ui компоненты
│   └── ...               # Кастомные компоненты
├── lib/                   # Утилиты и stores
│   ├── stores/           # Zustand stores
│   ├── data/             # Mock данные
│   └── types.ts          # TypeScript типы
└── public/                # Статические файлы
```

## Деплой

### Vercel (рекомендуется)

1. Подключите GitHub репозиторий к Vercel
2. Добавьте все переменные окружения в настройках проекта
3. Деплой произойдет автоматически

### Другие платформы

```bash
npm run build
npm start
```

## Troubleshooting

### Ошибка с Mapbox
- Убедитесь, что `NEXT_PUBLIC_MAPBOX_TOKEN` установлен
- Проверьте, что token имеет правильные разрешения

### Ошибка с NextAuth
- Убедитесь, что `NEXTAUTH_SECRET` установлен
- Проверьте, что `NEXTAUTH_URL` соответствует вашему домену

### Ошибка с Stripe
- Убедитесь, что используете test keys
- Проверьте, что ключи правильно скопированы

## Production Checklist

- [ ] Настроить production Mapbox token
- [ ] Настроить production Stripe keys
- [ ] Настроить production NextAuth secret
- [ ] Создать PWA иконки
- [ ] Настроить аналитику (Vercel Analytics)
- [ ] Настроить домен и SSL
- [ ] Настроить мониторинг ошибок (Sentry, etc.)
- [ ] Оптимизировать изображения
- [ ] Настроить CDN для статических файлов
