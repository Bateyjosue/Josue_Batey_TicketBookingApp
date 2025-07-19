import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsListPage from './pages/EventsListPage';
import EventDetailPage from './pages/EventDetailPage';
import Navigation from './components/Navigation';

// Placeholder page components
const BookingsListPage = () => <div>My Bookings Page</div>;
const BookingDetailPage = () => <div>Booking Detail Page</div>;
const AdminEventsPage = () => <div>Admin Events Management</div>;
const AdminBookingsPage = () => <div>Admin Bookings Management</div>;

function AppLayout() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      {!hideNav && <Navigation />}
      <div className={!hideNav ? 'pt-20' : ''}>
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
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
