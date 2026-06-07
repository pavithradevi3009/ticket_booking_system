# 🚀 GETTING STARTED - Ticket Booking System

## Quick Overview

This is a **single-page Ticket Booking System** for college students with:
- **Frontend:** React (User Interface)
- **Backend:** Express.js (API Server)  
- **Database:** MySQL (Data Storage)

---

## ⚠️ Prerequisites - Do This First!

### 1. Verify MySQL is Running

**For Windows:**
- Open Services (services.msc) and ensure MySQL is running
- Or open MySQL Command Line Client

**For Mac/Linux:**
```bash
sudo systemctl start mysql
# or
sudo /usr/local/mysql/support-files/mysql.server start
```

**Test MySQL Connection:**
```bash
mysql -u root -p
# Enter your MySQL password
# You should see: mysql>
# Type: exit
```

---

## 📦 Installation Steps

### Step 1: Create the Database (REQUIRED)

**Option A: Using Terminal/Command Line (FASTEST)**

```bash
cd /path/to/ticket_booking_system
mysql -u root -p < database.sql
```

Enter your MySQL root password when prompted.

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Go to **File → Open SQL Script**
3. Select `database.sql` from project folder
4. Click ⚡ Execute (or Ctrl+Shift+Enter)
5. You should see: "Query executed successfully"

**Option C: Manual Execution**

1. Open MySQL Command Line or Workbench
2. Run:
```sql
CREATE DATABASE IF NOT EXISTS ticketdb;
USE ticketdb;

CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  available_seats INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  ticket_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

INSERT INTO tickets (event_name, available_seats) VALUES
('College Symposium', 50),
('Tech Fest 2026', 100),
('Music Night', 75),
('Sports Championship', 200),
('Science Exhibition', 60);
```

**Verify Database Creation:**
```bash
mysql -u root -p
USE ticketdb;
SELECT * FROM tickets;
```

You should see 5 events in the table ✅

---

### Step 2: Start Backend Server

**Terminal 1 - Backend:**

```bash
cd /path/to/ticket_booking_system/backend
npm start
```

**Expected Output:**
```
✅ MySQL Connected Successfully!
🚀 Server Running on http://localhost:5000
```

⚠️ **If it says "Database Connection Failed":**
- Check MySQL is running
- Verify credentials in `backend/server.js` (default: root/root)
- Verify database `ticketdb` exists

---

### Step 3: Start Frontend Server

**Open a NEW Terminal - Terminal 2:**

```bash
cd /path/to/ticket_booking_system/frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view ticket-booking-frontend in the browser.

  Local:            http://localhost:3000
  
Press q to quit.
```

The browser will automatically open to `http://localhost:3000`

---

## 🎯 Using the Application

### 📋 Available Events Tab

1. See all college events
2. Check available seats for each event
3. Fill in your name and select an event
4. Click "✅ Book Ticket"
5. See confirmation message

### 🎫 My Bookings Tab

1. View all your bookings
2. See booking ID and event name
3. Click "❌ Cancel" to cancel any booking
4. Seats are automatically restored

---

## 🔌 Testing APIs (Optional)

You can test the APIs directly using Postman or curl:

### Get All Tickets
```bash
curl http://localhost:5000/api/tickets
```

### Book a Ticket
```bash
curl -X POST http://localhost:5000/api/book \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"John Doe","ticket_id":1}'
```

### Get All Bookings
```bash
curl http://localhost:5000/api/bookings
```

### Cancel a Booking
```bash
curl -X DELETE http://localhost:5000/api/bookings/1
```

---

## 🆘 Troubleshooting

### ❌ "Database Connection Failed"
**Solution:**
- [ ] MySQL is running (start it manually)
- [ ] Check username in `backend/server.js` (default: `root`)
- [ ] Check password in `backend/server.js` (default: `root`)
- [ ] Database `ticketdb` exists (run `database.sql`)

### ❌ Port 5000 Already in Use
```bash
# Kill process using port 5000
lsof -i :5000
kill -9 <PID>
```

### ❌ Port 3000 Already in Use
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### ❌ "Cannot GET /api/tickets"
- [ ] Backend server is running on port 5000
- [ ] Check the Network tab in browser DevTools
- [ ] Ensure CORS is enabled (it is in server.js)

### ❌ "CORS Error"
- [ ] Backend MUST run on port 5000
- [ ] Frontend MUST run on port 3000
- [ ] Both must be running together

### ❌ Bookings not saving
- [ ] Check MySQL Connection
- [ ] Database tables are created
- [ ] Use the correct database name `ticketdb`

---

## 📁 Project Structure

```
ticket_booking_system/
│
├── backend/
│   ├── server.js              ← Main Express server
│   ├── package.json           ← Node dependencies
│   └── node_modules/          ← Installed packages
│
├── frontend/
│   ├── src/
│   │   ├── App.js             ← Main React component (UI)
│   │   ├── App.css            ← Styling
│   │   ├── index.js           ← React entry point
│   │   └── index.css          ← Global styles
│   ├── public/
│   │   └── index.html         ← HTML template
│   ├── package.json           ← React dependencies
│   └── node_modules/          ← Installed packages
│
├── database.sql               ← MySQL setup script
├── README.md                  ← Project documentation
├── GETTING_STARTED.md         ← This file
└── STARTUP_GUIDE.sh           ← Quick startup script

```

---

## 🔑 Key Features

✅ **View Events** - See all available tickets  
✅ **Book Tickets** - Reserve seats for events  
✅ **View Bookings** - See all your reservations  
✅ **Cancel Booking** - Free up seats  
✅ **Responsive Design** - Works on desktop & mobile  
✅ **Real-time Updates** - Seat count updates instantly  
✅ **Database Persistence** - Data saved in MySQL  

---

## 💡 Important Notes

- **Default MySQL User:** `root`
- **Default MySQL Password:** `root`
- **Database Name:** `ticketdb`
- **Backend Port:** 5000
- **Frontend Port:** 3000

If your MySQL password is different, edit `backend/server.js` line 9:
```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",  // ← Change this
  database: "ticketdb",
});
```

---

## 🎓 For College Project

**Viva Questions You Might Get:**

Q: What are the main features?
A: View events, book tickets, view bookings, cancel bookings

Q: How is data stored?
A: MySQL database with two tables - tickets and bookings

Q: How do frontend and backend communicate?
A: REST APIs using Axios library with JSON data

Q: What happens when someone books a ticket?
A: A booking is created in the database and seat count decreases

Q: Can you show the database?
A: Run `mysql -u root -p ticketdb` and show the tables

---

## 🚀 Next Steps

1. **Run the system** following the installation steps above
2. **Test it** by booking tickets and viewing bookings
3. **Show the database** to your professor (mysql CLI or Workbench)
4. **Explain the code** in App.js and server.js

---

## 📞 Support

If you face issues:
1. Check all MySQL credentials
2. Ensure MySQL database is created
3. Restart both servers
4. Check browser console for errors (F12)
5. Check terminal for server errors

---

**Happy Booking! 🎉 Good Luck with your Project!**
