# Cryptozor.Ru


## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Стилизация**: Tailwind CSS 4, tailwind-variants, tailwind-merge
- **Управление состоянием**: Zustand
- **UI компоненты**: Radix UI, Lucide React
- **Интеграция с CMS**: Strapi Blocks Parser
- **Утилиты**: dayjs, clsx

## Структура проекта

```
├── app/                    # Основной код приложения
│   ├── api/                # API маршруты
│   ├── article/            # Страница отдельной статьи
│   ├── category/           # Страница категории
│   ├── features/           # Функциональные компоненты
│   ├── shared/             # Общие утилиты, хуки, типы
│   ├── tag/                # Страница тега
│   ├── tags/               # Страница всех тегов
│   ├── widgets/            # Виджеты (компоненты высшего уровня)
│   ├── globals.css         # Глобальные стили
│   ├── layout.tsx          # Корневой макет приложения
│   └── page.tsx            # Главная страница
├── public/                 # Статические файлы
├── next.config.ts         # Конфигурация Next.js
├── package.json           # Зависимости проекта
└── tsconfig.json          # Конфигурация TypeScript
```

## Установка и запуск

### Предварительные требования

- Node.js 18+ 
- Bun (рекомендуется) или npm/yarn

### Установка зависимостей

```bash
# С использованием Bun (рекомендуется)
bun install

# Или с использованием npm
npm install

# Или с использованием yarn
yarn install
```

### Настройка переменных окружения

Создайте файл `.env.local` в корне проекта и добавьте следующие переменные:

```
NEXT_PUBLIC_BASE_URL=http://localhost:1337
NEXT_PUBLIC_API_URL=http://localhost:1337/api
```

### Запуск в режиме разработки

```bash
# С использованием Bun
bun run dev

# Или с использованием npm
npm run dev

# Или с использованием yarn
yarn dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

### Сборка для продакшена

```bash
# С использованием Bun
bun run build

# Или с использованием npm
npm run build

# Или с использованием yarn
yarn build
```

### Запуск продакшен-версии

```bash
# С использованием Bun
bun run start

# Или с использованием npm
npm run start

# Или с использованием yarn
yarn start
```

## Интеграция с Strapi CMS

Приложение интегрируется с Strapi CMS для управления контентом. Убедитесь, что у вас настроен и запущен Strapi сервер с соответствующими типами контента:

- Articles (Статьи)
- Categories (Категории)
- Tags (Теги)