# ShowCaseADM

Админ-панель витрины проектов ТПУ.

## Стек

- Vite 8 + React 19 + TypeScript
- React Router 7
- TanStack Query + Zustand
- Axios (cookie-сессия)
- Plain CSS (токены light/dark)

## Быстрый старт

```bash
npm install
cp .env.example .env   # заполните VITE_TPU_OAUTH_CLIENT_ID
npm run dev
```

Откройте `http://localhost:5173`.

## Env

| Переменная | Назначение |
|---|---|
| `VITE_API_BASE_URL` | База API, по умолчанию `/dev/api` (проксируется Vite на `https://tpu.community.design`) |
| `VITE_TPU_OAUTH_CLIENT_ID` | OAuth client id ТПУ |
| `VITE_OAUTH_AUTHORIZE_URL` | URL authorize |
| `VITE_OAUTH_REDIRECT_URI` | Redirect URI (по умолчанию `{origin}/auth/callback`) |

## Разделы

- **Проекты** — список, деталка, статус, promo, команда, unblock
- **Пользователи** — поиск, курс (detail), назначение/снятие ролей
- **Роли** — компетенции (`role-types`) и скиллы
- **Настройки** — партнёры, чекпоинты, теги/группы, платформы, жалобы
- **Отчёты** — placeholder

## Скрипты

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
