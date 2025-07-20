import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsListPage from './pages/EventsListPage';
import EventDetailPage from './pages/EventDetailPage';
import Navigation from './components/Navigation';
import { Toaster } from 'react-hot-toast';
import { isTokenValid } from './store/useAuthStore';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useAuthStore } from './store/useAuthStore';
import EventListAdmin from './components/admin/EventListAdmin';
import { useEvents } from './hooks/useEvents';
import AdminLayout from './components/admin/AdminLayout';
import { useState } from 'react';
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from './hooks/useAdminEvents';
import EventFormModal from './components/admin/EventFormModal';
import EventDeleteDialog from './components/admin/EventDeleteDialog';
import type { AdminEvent } from './components/admin/EventCardAdmin';

// Placeholder page components
const BookingsListPage = () => <div>My Bookings Page</div>;
const BookingDetailPage = () => <div>Booking Detail Page</div>;

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  if (!user || user.role !== 'admin') {
    return <Navigate to="/events" replace />;
  }
  return <>{children}</>;
}

function AdminEventsPage() {
  const { data: events, isLoading } = useEvents();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<AdminEvent | null>(null);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const handleEdit = (event: AdminEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };
  const handleCreate = () => {
    setEditingEvent(null);
    setShowForm(true);
  };
  const handleDelete = (event: AdminEvent) => {
    setDeletingEvent(event);
    setShowDelete(true);
  };
  const handleFormSubmit = async (values: Omit<AdminEvent, '_id'>) => {
    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({ id: editingEvent._id, ...values });
      } else {
        await createEvent.mutateAsync(values);
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch {
      // Optionally show error toast
    }
  };
  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    try {
      await deleteEvent.mutateAsync(deletingEvent._id);
      setShowDelete(false);
      setDeletingEvent(null);
    } catch {
      // Optionally show error toast
    }
  };
  return (
    <AdminLayout title="Events">
      <div className="ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-6">
          <button
            className="bg-zinc-800 text-yellow-400 px-4 py-2 rounded-lg font-bold hover:bg-yellow-700 transition-colors"
            onClick={() => navigate('/admin')}
          >
            ← Back to Dashboard
          </button>
          <button
            className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors text-lg"
            onClick={handleCreate}
          >
            + Create Event
          </button>
        </div>
        <EventListAdmin
          events={events || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <EventFormModal
          open={showForm}
          onClose={() => { setShowForm(false); setEditingEvent(null); }}
          onSubmit={handleFormSubmit}
          initialValues={editingEvent ? { ...editingEvent, date: editingEvent.date.slice(0, 16) } : undefined}
          loading={createEvent.isLoading || updateEvent.isLoading}
          error={
            createEvent.error instanceof Error ? createEvent.error.message
            : (updateEvent.error as Error)?.message ?? null
          }
        />
        <EventDeleteDialog
          open={showDelete}
          onClose={() => { setShowDelete(false); setDeletingEvent(null); }}
          onConfirm={handleDeleteConfirm}
          eventTitle={deletingEvent?.title || ''}
          loading={deleteEvent.isLoading}
          error={deleteEvent.error instanceof Error ? deleteEvent.error.message : null}
        />
      </div>
    </AdminLayout>
  );
}

function AppLayout() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/register';
  const user = useAuthStore(state => state.user);
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
            path="/dashboard"
            element={
              <RequireAuth>
                {user?.role === 'admin' ? <AdminDashboardPage /> : <CustomerDashboardPage />}
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <AdminDashboardPage />
                </RequireAdmin>
              </RequireAuth>
            }
          />
          <Route
            path="/admin/events"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <AdminEventsPage />
                </RequireAdmin>
              </RequireAuth>
            }
          />

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
