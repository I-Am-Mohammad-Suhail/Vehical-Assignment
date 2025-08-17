# Vehical Assignment (Backend)

Node.js + Express + MongoDB backend for vehicle registration analytics (Vahan-style). 
Features:
- Manufacturer-wise and vehicle-type-wise summaries
- YoY (Year-over-Year) and QoQ (Quarter-over-Quarter) growth
- Flexible filters: state, date range, manufacturer, type
- Seed script with sample data
- CORS, Helmet, Morgan, ENV config

## Quick Start

```bash
# 1) Install
npm install

# 2) Configure
cp .env.example .env
# Update MONGODB_URI if needed

# 3) Seed sample data
npm run seed

# 4) Run
npm run dev
# API on http://localhost:4000
```

## API Endpoints

- `GET /health` — service health
- `GET /api/registrations/summary?from=YYYY-MM-DD&to=YYYY-MM-DD&state=DL&type=2W&manufacturer=Honda`  
  Aggregated count in the range with optional filters.
- `GET /api/registrations/yoy?date=YYYY-MM-DD&state=DL&type=4W`  
  Growth vs same date range last year (default: last full month).
- `GET /api/registrations/qoq?date=YYYY-MM-DD&state=DL&type=4W`  
  Growth vs previous quarter (default: current quarter-to-date vs previous quarter).
- `GET /api/types/distribution?from=YYYY-MM-DD&to=YYYY-MM-DD&state=DL`  
  Share by vehicle type.
- `GET /api/manufacturers/top?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=10&state=DL&type=2W`  
  Top manufacturers by registrations.

### Query Rules
- If `from`/`to` missing: defaults to last 90 days.
- Types allowed: `2W`, `3W`, `4W`.
- Dates must be `YYYY-MM-DD`.

## Project Structure
```
src/
  server.js
  app.js
  db.js
  models/Registration.js
  routes/index.js
  controllers/analyticsController.js
  utils/dateRanges.js
  middleware/error.js
  scripts/seed.js
data/
  sample.json
.env.example
```

## Notes
- Replace sample data with real Vahan-extracted records for production.
- All aggregations use MongoDB pipelines for performance.
