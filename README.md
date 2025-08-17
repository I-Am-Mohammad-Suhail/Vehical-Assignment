# Vehicle Registration Analytics Dashboard (Vahan Data)

## 📌 Project Overview
This project is a simple **backend + dashboard** that analyzes Indian vehicle registration data (sourced from the **Vahan Dashboard**).  
It provides insights into:
- Vehicle type-wise registrations (2W, 3W, 4W)
- Manufacturer-wise market share
- Growth trends (Year-over-Year and Quarter-over-Quarter)

The goal is to present this from an **investor’s perspective** – highlighting which vehicle categories and manufacturers are growing fastest.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (>= 16)
- MongoDB (local or Atlas)

### Steps to Run
```bash
# 1. Clone the repo
git clone <your-repo-link>

# 2. Go inside project folder
cd vehical-assignment

# 3. Install dependencies
npm install

# 4. Start the server
npm start

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

- Replace sample data with real Vahan-extracted records for production.
- All aggregations use MongoDB pipelines for performance.
