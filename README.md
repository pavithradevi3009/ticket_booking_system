# 🎟️ Ticket Booking System - College Project

A simple single-page ticket booking system built with **React**, **Express.js**, and **SQLite**.

## Features

- View available events
- Add new events from UI
- Book tickets from UI
- View booked tickets
- Cancel bookings
- Data saved in SQLite
- One server can host both frontend and backend

## Project Structure

```
ticket_booking_system/
├── backend/
│   ├── data/              # SQLite database file is stored here
│   ├── server.js          # Express server and SQLite logic
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── database.sql           # Optional SQLite schema & sample data
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

No separate database server is required because the app uses SQLite.

## Installation & Setup

### Step 1: Backend Setup

```bash
cd /workspaces/ticket_booking_system/backend
npm install
npm start
```

The backend creates the SQLite database file automatically at `backend/data/ticketdb.sqlite` and seeds sample tickets if needed.

Expected server output:

```
✅ SQLite database connected successfully!
🚀 Server Running on http://localhost:5000
```

### Step 2: Frontend Setup

In a second terminal:

```bash
cd /workspaces/ticket_booking_system/frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000` and talks to the backend via `/api`.

### Step 3: Production Deployment

Build the React app and serve it from the Express backend:

```bash
cd /workspaces/ticket_booking_system/frontend
npm run build
cd ../backend
npm start
```

Open `http://localhost:5000` to use the app from one server.

## Frontend Behavior

- Add events in the "Available Events" tab
- Book tickets with name and selected event
- View bookings in the "My Bookings" tab
- Cancel bookings and restore seats

## API Endpoints

- `GET /api/tickets` — list available events
- `POST /api/tickets` — add a new event
- `POST /api/book` — book a ticket
- `GET /api/bookings` — list bookings
- `DELETE /api/bookings/:id` — cancel a booking

## SQLite Database Script

If you want to inspect or recreate the schema manually, use `database.sql`.

## Notes

- In development, the frontend uses `proxy: "http://localhost:5000"` so `/api` works from React.
- In production, the backend serves the built React files from `frontend/build`.

## Troubleshooting

- If the backend fails, make sure `node_modules` is installed in `backend/`.
- If the frontend fails, make sure `node_modules` is installed in `frontend/`.
- The SQLite DB file is created automatically under `backend/data/`.

