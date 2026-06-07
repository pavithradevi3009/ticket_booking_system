# 🎟️ TICKET BOOKING SYSTEM - QUICK START

## ⚡ 3-Step Setup (5 minutes)

### Step 1️⃣: Setup MySQL Database
Run this **ONE TIME** in terminal or MySQL Workbench:
```bash
cd /workspaces/ticket_booking_system
mysql -u root -p < database.sql
```
Enter your MySQL root password.

✅ Done when you see: `Query executed successfully`

---

### Step 2️⃣: Start Backend Server
Open **Terminal 1** and run:
```bash
cd /workspaces/ticket_booking_system/backend
npm start
```

✅ Wait for this message:
```
✅ MySQL Connected Successfully!
🚀 Server Running on http://localhost:5000
```

---

### Step 3️⃣: Start Frontend App
Open **Terminal 2** and run:
```bash
cd /workspaces/ticket_booking_system/frontend
npm start
```

✅ App automatically opens at: **http://localhost:3000**

---

## 🎯 Your App is Ready!

**Available Tabs:**
- 📋 **Available Events** - View events & book tickets
- 🎫 **My Bookings** - View & cancel your bookings

**Try This:**
1. Enter your name
2. Select "Tech Fest 2026"
3. Click "✅ Book Ticket"
4. Go to "My Bookings" tab
5. See your booking!

---

## 📍 Default Credentials

```
MySQL User: root
MySQL Password: root
Database: ticketdb
Backend: http://localhost:5000
Frontend: http://localhost:3000
```

If your MySQL password is different, edit: `backend/server.js` line 9

---

## 📚 Full Documentation

- **README.md** - Complete project info
- **GETTING_STARTED.md** - Detailed setup guide
- **PROJECT_SUMMARY.md** - Features & architecture

---

## 🆘 Issues?

| Issue | Solution |
|-------|----------|
| "Database Connection Failed" | Check MySQL is running, verify password |
| Port 5000 in use | `kill -9 $(lsof -t -i:5000)` |
| Port 3000 in use | `kill -9 $(lsof -t -i:3000)` |
| Blank page at localhost:3000 | Wait 30 seconds for React to compile |

---

## 🎓 Show Your Professor

1. **Database:** `mysql -u root -p -e "SELECT * FROM ticketdb.tickets;"`
2. **Backend:** Running on port 5000
3. **Frontend:** Running on port 3000 with UI
4. **Code:** Check App.js, server.js, database.sql

---

## 🎉 Happy Booking!

**Everything is installed and ready to use!**

Just follow the 3 steps above to run the system.

Good luck with your college project! 🚀
