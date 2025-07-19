import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Placeholder page components
const EventsListPage = () => <div>Events List Page</div>;
const EventDetailPage = () => <div>Event Detail Page</div>;
const BookingsListPage = () => <div>My Bookings Page</div>;
const BookingDetailPage = () => <div>Booking Detail Page</div>;
const AdminEventsPage = () => <div>Admin Events Management</div>;
const AdminBookingsPage = () => <div>Admin Bookings Management</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Events */}
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />

        {/* Bookings */}
        <Route path="/bookings" element={<BookingsListPage />} />
        <Route path="/bookings/:id" element={<BookingDetailPage />} />

        {/* Admin */}
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
