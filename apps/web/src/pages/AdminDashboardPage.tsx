import { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useBookings } from '../hooks/useBookings';
import AdminLayout from '../components/admin/AdminLayout';
import EventFormModal from '../components/admin/EventFormModal';
import EventDeleteDialog from '../components/admin/EventDeleteDialog';
import toast from 'react-hot-toast';
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useAdminEvents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import type { AdminEvent } from '../components/admin/EventCardAdmin';

export default function AdminDashboardPage() {
  const { data: events, isLoading } = useEvents();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<AdminEvent | null>(null);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const handleCreate = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save event';
      toast.error(message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    try {
      await deleteEvent.mutateAsync(deletingEvent._id);
      toast.success('Event deleted!');
      setShowDelete(false);
      setDeletingEvent(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      toast.error(message);
    }
  };

  const attendanceData = (events && bookings)
    ? (events as AdminEvent[]).map((event: AdminEvent): { title: string; attendance: number } => ({
        title: event.title,
        attendance: (bookings as Booking[]).filter((b) => b.event === event._id).length
      }))
    : [];

  const topEvents = attendanceData
    .slice()
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 5);

  const bookingsOverTime = bookings
    ? bookings.reduce((acc: Record<string, number>, booking: Booking & { createdAt?: string }) => {
        const date = booking.createdAt ? booking.createdAt.slice(0, 10) : 'Unknown';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {})
    : {};
  const bookingsOverTimeData = Object.entries(bookingsOverTime)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AdminLayout title="Manage Events">
      <div className="ml-0 md:ml-64">
        <div className="flex flex-wrap items-center gap-6 mb-10 w-full max-w-5xl mx-auto">
          <button
            className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors text-lg"
            onClick={handleCreate}
          >
            + Create Event
          </button>
          <div className="flex gap-6 flex-wrap">
            <div className="bg-zinc-900 rounded-xl p-6 flex flex-col items-center shadow border border-yellow-700 min-w-[180px]">
              <span className="text-yellow-400 text-2xl font-bold">{isLoading ? '...' : (events?.length ?? 0)}</span>
              <span className="text-zinc-300 mt-2">Total Events</span>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 flex flex-col items-center shadow border border-yellow-700 min-w-[180px]">
              <span className="text-yellow-400 text-2xl font-bold">{bookingsLoading ? '...' : (bookings?.length ?? 0)}</span>
              <span className="text-zinc-300 mt-2">Total Bookings</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 items-center w-full max-w-5xl mx-auto">
          {/* Attendance Chart */}
          <div className="bg-zinc-900 rounded-xl p-6 shadow border border-yellow-700 w-full">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">Event Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData} margin={{ top: 16, right: 16, left: 16, bottom: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="title" angle={-20} textAnchor="end" interval={0} tick={{ fill: '#fff', fontSize: 12 }} height={60} />
                <YAxis tick={{ fill: '#fff', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#222', border: '1px solid #eab308', color: '#fff' }} />
                <Bar dataKey="attendance" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Top Events by Attendance */}
          <div className="bg-zinc-900 rounded-xl p-6 shadow border border-yellow-700 w-full">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">Top 5 Events by Attendance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topEvents} layout="vertical" margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" tick={{ fill: '#fff', fontSize: 12 }} allowDecimals={false} />
                <YAxis dataKey="title" type="category" tick={{ fill: '#fff', fontSize: 12 }} width={120} />
                <Tooltip contentStyle={{ background: '#222', border: '1px solid #eab308', color: '#fff' }} />
                <Bar dataKey="attendance" fill="#eab308" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Bookings Over Time */}
          <div className="bg-zinc-900 rounded-xl p-6 shadow border border-yellow-700 w-full">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">Bookings Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={bookingsOverTimeData} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" tick={{ fill: '#fff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#fff', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#222', border: '1px solid #eab308', color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
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