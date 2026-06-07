const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SQLite database setup
const dataFolder = path.join(__dirname, "data");
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}

const dbPath = path.join(dataFolder, "ticketdb.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed ❌", err);
    return;
  }
  console.log("✅ SQLite database connected successfully!");
});

// Initialize tables and seed sample data when needed
const initSql = `
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_name TEXT NOT NULL,
  available_seats INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  ticket_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);
`;

db.serialize(() => {
  db.exec(initSql, (err) => {
    if (err) {
      console.error("Failed to create tables:", err);
      return;
    }

    db.get("SELECT COUNT(*) AS count FROM tickets", (err, row) => {
      if (err) {
        console.error("Failed to count tickets:", err);
        return;
      }

      if (row.count === 0) {
        const insertTickets = `INSERT INTO tickets (event_name, available_seats) VALUES
          ('College Symposium', 50),
          ('Tech Fest 2026', 100),
          ('Music Night', 75),
          ('Sports Championship', 200),
          ('Science Exhibition', 60)
        `;
        db.run(insertTickets, (insertErr) => {
          if (insertErr) {
            console.error("Failed to seed tickets:", insertErr);
          }
        });
      }
    });
  });
});

// ============== API Routes ==============

// 1. Get all tickets
app.get("/api/tickets", (req, res) => {
  db.all("SELECT * FROM tickets", (err, rows) => {
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

  db.run(
    "INSERT INTO tickets (event_name, available_seats) VALUES (?, ?)",
    [event_name, seats],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Event added successfully!", ticket_id: this.lastID });
    }
  );
});

// 2. Book a ticket
app.post("/api/book", (req, res) => {
  const { customer_name, ticket_id } = req.body;
  if (!customer_name || !ticket_id) {
    return res.status(400).json({ error: "Customer name and ticket ID are required" });
  }

  db.get("SELECT available_seats FROM tickets WHERE id = ?", [ticket_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Event not found" });
    if (row.available_seats < 1) return res.status(400).json({ error: "No seats available" });

    db.run(
      "INSERT INTO bookings (customer_name, ticket_id) VALUES (?, ?)",
      [customer_name, ticket_id],
      function (insertErr) {
        if (insertErr) return res.status(500).json({ error: insertErr.message });

        db.run(
          "UPDATE tickets SET available_seats = available_seats - 1 WHERE id = ?",
          [ticket_id],
          function (updateErr) {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            res.json({ message: "✅ Ticket Booked Successfully!", booking_id: this.lastID });
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

  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 4. Cancel booking
app.delete("/api/bookings/:id", (req, res) => {
  const bookingId = req.params.id;

  db.get("SELECT ticket_id FROM bookings WHERE id = ?", [bookingId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Booking not found" });

    const ticketId = row.ticket_id;
    db.run("DELETE FROM bookings WHERE id = ?", [bookingId], function (deleteErr) {
      if (deleteErr) return res.status(500).json({ error: deleteErr.message });

      db.run(
        "UPDATE tickets SET available_seats = available_seats + 1 WHERE id = ?",
        [ticketId],
        function (updateErr) {
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
