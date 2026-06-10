const express = require("express");
const mysql = require('mysql2');
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔌 MySQL Database Connection Setup
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '', // Leave empty since your Codespace doesn't require a password
  database: 'ticket_booking_system'
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed ❌", err);
    return;
  }
  console.log("✅ MySQL Database connected successfully!");
});

// ============== API Routes ==============

// 1. Get all tickets
app.get("/api/tickets", (req, res) => {
  db.query("SELECT * FROM tickets", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 1b. Add a new event/ticket
app.post("/api/tickets", (req, res) => {
  const { event_name, available_seats } = req.body;
  if (!event_name || available_seats === undefined) {
    return res.status(400).json({ error: "Event name and seat count are required" });
  }

  const seats = Number(available_seats);
  if (Number.isNaN(seats) || seats < 1) {
    return res.status(400).json({ error: "Available seats must be a positive number" });
  }

  db.query(
    "INSERT INTO tickets (event_name, available_seats) VALUES (?, ?)",
    [event_name, seats],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Event added successfully!", ticket_id: result.insertId });
    }
  );
});

// 2. Book a ticket
app.post("/api/book", (req, res) => {
  const { customer_name, ticket_id } = req.body;
  if (!customer_name || !ticket_id) {
    return res.status(400).json({ error: "Customer name and ticket ID are required" });
  }

  db.query("SELECT available_seats FROM tickets WHERE id = ?", [ticket_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Event not found" });
    
    const row = rows[0];
    if (row.available_seats < 1) return res.status(400).json({ error: "No seats available" });

    db.query(
      "INSERT INTO bookings (customer_name, ticket_id) VALUES (?, ?)",
      [customer_name, ticket_id],
      (insertErr, result) => {
        if (insertErr) return res.status(500).json({ error: insertErr.message });

        db.query(
          "UPDATE tickets SET available_seats = available_seats - 1 WHERE id = ?",
          [ticket_id],
          (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            res.json({ message: "✅ Ticket Booked Successfully!", booking_id: result.insertId });
          }
        );
      }
    );
  });
});

// 3. Get all bookings
app.get("/api/bookings", (req, res) => {
  const query = `
    SELECT bookings.id,
           bookings.customer_name,
           tickets.event_name,
           tickets.available_seats
    FROM bookings
    JOIN tickets ON bookings.ticket_id = tickets.id
    ORDER BY bookings.id DESC
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 4. Cancel booking
app.delete("/api/bookings/:id", (req, res) => {
  const bookingId = req.params.id;

  db.query("SELECT ticket_id FROM bookings WHERE id = ?", [bookingId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Booking not found" });

    const ticketId = rows[0].ticket_id;
    db.query("DELETE FROM bookings WHERE id = ?", [bookingId], (deleteErr) => {
      if (deleteErr) return res.status(500).json({ error: deleteErr.message });

      db.query(
        "UPDATE tickets SET available_seats = available_seats + 1 WHERE id = ?",
        [ticketId],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: updateErr.message });
          res.json({ message: "✅ Booking cancelled successfully!" });
        }
      );
    });
  });
});

// Serve frontend from backend in production
const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Running on http://localhost:${PORT}`);
});
