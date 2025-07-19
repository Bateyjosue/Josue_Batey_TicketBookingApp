import React, { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import AdminLayout from '../components/admin/AdminLayout';
import EventListAdmin from '../components/admin/EventListAdmin';
import type { AdminEvent } from '../components/admin/EventCardAdmin';
import EventFormModal from '../components/admin/EventFormModal';
import EventDeleteDialog from '../components/admin/EventDeleteDialog';
import toast from 'react-hot-toast';
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useAdminEvents';

export default function AdminDashboardPage() {
  const { data: events, isLoading, error } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<AdminEvent | null>(null);
//   const [showBookings, setShowBookings] = useState(false);
//   const [selectedEventForBookings, setSelectedEventForBookings] = useState<AdminEvent | null>(null);

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
//   const handleViewBookings = (event: AdminEvent) => {
//     setSelectedEventForBookings(event);
//     setShowBookings(true);
//     toast('Bookings modal coming soon!');
//   };

  const handleFormSubmit = async (values: Omit<AdminEvent, '_id'>) => {
    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({ id: editingEvent._id, ...values });
        toast.success('Event updated!');
      } else {
        await createEvent.mutateAsync(values);
        toast.success('Event created!');
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save event');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    try {
      await deleteEvent.mutateAsync(deletingEvent._id);
      toast.success('Event deleted!');
      setShowDelete(false);
      setDeletingEvent(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete event');
    }
  };

  return (
    <AdminLayout title="Manage Events">
      <div className="flex justify-end mb-8">
        <button
          className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors text-lg"
          onClick={handleCreate}
        >
          + Create Event
        </button>
      </div>
      {isLoading ? (
        <div className="text-yellow-300">Loading events...</div>
      ) : error ? (
        <div className="text-red-400">Failed to load events.</div>
      ) : (
        <EventListAdmin
          events={events as AdminEvent[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        //   onViewBookings={handleViewBookings}
        />
      )}
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
      {/* Bookings modal placeholder */}
      {/* {showBookings && selectedEventForBookings && (
        <BookingsModal event={selectedEventForBookings} onClose={() => setShowBookings(false)} />
      )} */}
    </AdminLayout>
  );
} 