# HCFC

## Stack Overview

### Backend

- Node.js (v24.1.0)
- Express 5
- TypeScript
- Prisma ORM (PostgreSQL)
- Jest + ts-jest + Supertest (unit, integration, e2e)
- tsx (dev runtime)
- Prettier (Airbnb-style conventions)

Scripts (from `backend/`):

- `npm run dev` – start dev server with tsx
- `npm run build` – compile TypeScript
- `npm start` – run compiled server
- `npm test` – run tests (DB mocked in tests)
- `npm run format` / `format:check` – Prettier format/check

### Frontend

- Vite
- React + TypeScript
- Prettier (Airbnb-style conventions)

Scripts (from `frontend/`):

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview build
- `npm run format` / `format:check` – Prettier format/check

### Deploy

- Render: https://epa-household-calculator.onrender.com
- Vercel: https://epa-household-calculator.vercel.app
