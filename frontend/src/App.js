import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [activeTab, setActiveTab] = useState("tickets");
  const [loading, setLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newEventName, setNewEventName] = useState("");
  const [newEventSeats, setNewEventSeats] = useState("");

  const API_BASE_URL = "/api";

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
    fetchBookings();
  }, []);

  // Fetch all available tickets
  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tickets`);
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setMessage("❌ Error fetching tickets");
    }
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage("❌ Error fetching bookings");
    }
  };

  // Book a ticket
  const handleBookTicket = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setMessage("❌ Please enter your name");
      return;
    }

    if (!selectedTicketId) {
      setMessage("❌ Please select an event");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/book`, {
        customer_name: customerName,
        ticket_id: parseInt(selectedTicketId),
      });

      setMessage(response.data.message);
      setCustomerName("");
      setSelectedTicketId("");

      // Refresh data
      fetchTickets();
      fetchBookings();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Error booking ticket: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Add a new event
  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!newEventName.trim()) {
      setMessage("❌ Please enter an event name");
      return;
    }

    if (!newEventSeats || Number(newEventSeats) < 1) {
      setMessage("❌ Please enter a valid seat count");
      return;
    }

    setEventLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/tickets`, {
        event_name: newEventName,
        available_seats: parseInt(newEventSeats, 10),
      });

      setMessage(response.data.message);
      setNewEventName("");
      setNewEventSeats("");

      fetchTickets();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Error adding event: " + (error.response?.data?.error || error.message));
    } finally {
      setEventLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`);
        setMessage(response.data.message);

        // Refresh data
        fetchTickets();
        fetchBookings();

        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("❌ Error cancelling booking: " + (error.response?.data?.error || error.message));
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🎟️ Ticket Booking System</h1>

        {/* Message Alert */}
        {message && (
          <div className={`alert ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "tickets" ? "active" : ""}`}
            onClick={() => setActiveTab("tickets")}
          >
            📋 Available Events
          </button>
          <button
            className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            🎫 My Bookings
          </button>
        </div>

        {/* Available Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="tab-content">
            <h2>Available Events</h2>

            {/* Ticket Listing */}
            <div className="tickets-grid">
              {tickets.length === 0 ? (
                <p className="no-data">No events available</p>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <h3>{ticket.event_name}</h3>
                    <p className="seats-info">
                      💺 Available Seats: <strong>{ticket.available_seats}</strong>
                    </p>
                    <p className="ticket-id">Event ID: {ticket.id}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Event Form */}
            <div className="booking-form">
              <h3>Add New Event</h3>
              <form onSubmit={handleAddEvent}>
                <div className="form-group">
                  <label htmlFor="eventName">Event Name</label>
                  <input
                    id="eventName"
                    type="text"
                    placeholder="Enter new event name"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="seats">Available Seats</label>
                  <input
                    id="seats"
                    type="number"
                    min="1"
                    placeholder="Enter number of seats"
                    value={newEventSeats}
                    onChange={(e) => setNewEventSeats(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" disabled={eventLoading} className="btn-book">
                  {eventLoading ? "Adding..." : "✅ Add Event"}
                </button>
              </form>
            </div>

            {/* Booking Form */}
            <div className="booking-form">
              <h3>Book Your Ticket</h3>
              <form onSubmit={handleBookTicket}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="event">Select Event</label>
                  <select
                    id="event"
                    value={selectedTicketId}
                    onChange={(e) => setSelectedTicketId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose an Event --</option>
                    {tickets.map((ticket) => (
                      <option key={ticket.id} value={ticket.id}>
                        {ticket.event_name} ({ticket.available_seats} seats left)
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" disabled={loading} className="btn-book">
                  {loading ? "Booking..." : "✅ Book Ticket"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="tab-content">
            <h2>My Bookings</h2>

            {bookings.length === 0 ? (
              <p className="no-data">You haven't booked any tickets yet</p>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-info">
                      <h4>📌 {booking.event_name}</h4>
                      <p>
                        <strong>Name:</strong> {booking.customer_name}
                      </p>
                      <p>
                        <strong>Booking ID:</strong> {booking.id}
                      </p>
                    </div>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
