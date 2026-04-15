# Qamarun Beauty

Qamarun Beauty is a full-stack academic e-commerce web application focused only on organic skincare products. It includes customer shopping features and an admin dashboard for managing products, users, and orders.

## Features

- Secure registration and login with token-based session handling
- Product catalog with search, category filtering, product details, and ingredient/benefit visibility
- Shopping cart with quantity updates and persistent local cart storage
- Mock checkout flow that creates real saved orders through the backend API
- Order history for customers with cancellation support while orders are still processing
- Order status email notifications for processing, shipped, delivered, and cancelled updates
- Admin dashboard with product CRUD, direct image upload, user management, and order status management
- OTP-based forgot password flow with SMTP email support or local mailbox log fallback

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: SQLite

## Project Structure

```text
.
|-- server/
|   |-- data/qamarun.db
|   |-- data/mailbox.log
|   |-- db.js
|   |-- index.js
|   |-- mailer.js
|   `-- schema.md
|-- src/
|   |-- app/
|   |   |-- components/
|   |   |-- context/
|   |   |-- layouts/
|   |   |-- lib/api.ts
|   |   |-- pages/
|   |   |-- routes.tsx
|   |   `-- types.ts
|   |-- main.tsx
|   `-- styles/
|-- index.html
|-- package.json
`-- vite.config.ts
```

## Demo Accounts

- Admin: `admin@qamarun.com` / `admin123`
- User: `user@example.com` / `user123`

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start frontend and backend together:

```bash
npm run dev:full
```

Optional:

```bash
copy .env.example .env
```

3. Open the frontend:

```text
http://localhost:5173
```

4. The API runs at:

```text
http://localhost:4000
```

## Build

```bash
npm run build
```

## SQLite Testing

- The SQLite database file is created automatically at `server/data/qamarun.db`
- You can open it with DB Browser for SQLite
- Tables are seeded automatically on first server start

## Email Testing

- OTP and order status emails use SMTP when configured
- Without SMTP config, outgoing messages are written to `server/data/mailbox.log` for local testing
- Copy `.env.example` to `.env` and add your SMTP credentials to send real emails during testing

## Notes

- Payments are mocked for academic demonstration.
- The data model is documented in `server/schema.md`.
