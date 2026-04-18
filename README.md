# StockLedger

Warehouse inventory management with products, suppliers, purchase orders, and low-stock alerts.

## Features

- Product catalog with SKU and stock levels
- Supplier management
- Purchase orders with line items
- Low-stock alerts endpoint and dashboard
- Multi-page UI: dashboard, products, suppliers, orders, alerts

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Backend  | TypeScript, Node.js, Express, Mongoose, tsx |
| Frontend | TypeScript, React, Vite, React Router       |
| Database | MongoDB                 |

## Ports

| Service | Port |
|---------|------|
| UI      | 5024 |
| API     | 6024 |

## Quick Start

```bash
cp .env.example .env
cd backend && npm install
cd ../frontend && npm install
```

Terminal 1: `cd backend && npm run dev`  
Terminal 2: `cd frontend && npm run dev`

- **UI:** http://localhost:5024
- **API:** http://localhost:6024

## Project Structure

```
StockLedger/
├── backend/          # Express API
├── frontend/         # React inventory UI
├── docker-compose.yml
└── .env.example
```

## License

MIT
