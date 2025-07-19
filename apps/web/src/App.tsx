import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsListPage from './pages/EventsListPage';
import EventDetailPage from './pages/EventDetailPage';
import Navigation from './components/Navigation';
import { Toaster } from 'react-hot-toast';
import { isTokenValid } from './store/useAuthStore';

// Placeholder page components
const BookingsListPage = () => <div>My Bookings Page</div>;
const BookingDetailPage = () => <div>Booking Detail Page</div>;
const AdminEventsPage = () => <div>Admin Events Management</div>;
const AdminBookingsPage = () => <div>Admin Bookings Management</div>;

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

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

          {/* Protected */}
          <Route
            path="/events"
            element={
              <RequireAuth>
                <EventsListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/events/:id"
            element={
              <RequireAuth>
                <EventDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/bookings"
            element={
              <RequireAuth>
                <BookingsListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <RequireAuth>
                <BookingDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/events"
            element={
              <RequireAuth>
                <AdminEventsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <RequireAuth>
                <AdminBookingsPage />
              </RequireAuth>
            }
          />

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
      <Toaster position="top-center" toastOptions={{
        style: { background: '#18181b', color: '#FFD700', fontWeight: 'bold' },
        success: { iconTheme: { primary: '#FFD700', secondary: '#18181b' } },
        error: { iconTheme: { primary: '#ff3333', secondary: '#18181b' } },
      }} />
      <AppLayout />
    </Router>
  );
}

export default App;
