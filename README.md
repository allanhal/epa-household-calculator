![HCFC](frontend/src/assets/hcfc_ok.svg)

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
- MUI Components

Scripts (from `frontend/`):

- `yarn dev` – start Vite dev server
- `yarn build` – production build
- `yarn preview` – preview build
- `yarn format` / `yarn format:check` – Prettier format/check

### Deploy

- Render: https://epa-household-calculator.onrender.com
- Vercel: https://epa-household-calculator.vercel.app

---

## Environment configuration (.env)

You can tune the calculator by overriding emission factors and waste values via environment variables. All factors are expressed in pounds of CO₂ unless noted otherwise.

### Backend (.env)

Emission factors used in calculations (defaults shown in parentheses):

- ELECTRICITY_EMISSION_FACTOR (0.92)
  - lbs CO₂ per kWh
- NATURAL_GAS_EMISSION_FACTOR (11.7)
  - lbs CO₂ per therm
- FUEL_OIL_EMISSION_FACTOR (22.4)
  - lbs CO₂ per gallon
- PROPANE_EMISSION_FACTOR (12.7)
  - lbs CO₂ per gallon
- GASOLINE_EMISSION_FACTOR (19.6)
  - lbs CO₂ per gallon (used for transportation: miles ÷ mpg × factor)
- DIESEL_EMISSION_FACTOR (22.4)
  - lbs CO₂ per gallon (not currently used by UI but supported)

Waste-related values (annual, in lbs CO₂):

- PER_PERSON_WASTE (692)
  - Baseline annual waste emissions per person
- PAPER_WASTE (184)
  - Reduction if recycling paper is enabled
- PLASTIC_WASTE (25)
  - Reduction if recycling plastic is enabled
- METAL_WASTE (166)
  - Reduction if recycling metal is enabled
- GLASS_WASTE (46)
  - Reduction if recycling glass is enabled

Database (only needed for real DB runs; tests mock Prisma):

- DATABASE_URL
  - PostgreSQL connection string used by Prisma (using supabase for render.com deploy)

Example backend `.env`:

```
# Emission factors (lbs CO₂ per unit)
ELECTRICITY_EMISSION_FACTOR=0.92
NATURAL_GAS_EMISSION_FACTOR=11.7
FUEL_OIL_EMISSION_FACTOR=22.4
PROPANE_EMISSION_FACTOR=12.7
GASOLINE_EMISSION_FACTOR=19.6
DIESEL_EMISSION_FACTOR=22.4

# Waste (annual lbs CO₂)
PER_PERSON_WASTE=692
PAPER_WASTE=184
PLASTIC_WASTE=25
METAL_WASTE=166
GLASS_WASTE=46

# Prisma (optional for local dev if not using mocked tests)
# DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
```

### Frontend (.env)

- VITE_API
  - Base URL for the API. Defaults to `http://localhost:8080` when not set.

Example frontend `.env`:

```
VITE_API=https://epa-household-calculator.onrender.com
```
