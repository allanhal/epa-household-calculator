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

- `yarn dev` – start dev server with tsx
- `yarn build` – compile TypeScript
- `yarn start` – run compiled server
- `yarn test` – run tests (DB mocked in tests)
- `yarn format` / `yarn format:check` – Prettier format/check

### Frontend

- Vite
- React + TypeScript
- Prettier (Airbnb-style conventions)

Scripts (from `frontend/`):

- `yarn dev` – start Vite dev server
- `yarn build` – production build
- `yarn preview` – preview build
- `yarn format` / `yarn format:check` – Prettier format/check

### Deploy

- Render: https://epa-household-calculator.onrender.com
- Vercel: https://epa-household-calculator.vercel.app
