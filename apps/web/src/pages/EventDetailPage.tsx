import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useEvent';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import EventSkeleton from '../components/EventSkeleton';
import { useBookEvent } from '../hooks/useBookEvent';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(id);
  const navigate = useNavigate();
  const bookEvent = useBookEvent();

  // Assume event.capacity and event.bookedCount are available
  const isSoldOut = event && event.capacity !== undefined && event.bookedCount !== undefined && event.bookedCount >= event.capacity;

  // Organizer name logic
  const organizerName = event?.organizer?.name || event?.organizer || 'Organizer';
  const organizerUsername = event?.organizer?.username ? `@${event.organizer.username}` : (event?.organizer?.username ? `@${event.organizer}` : '');

  // Date logic
  const startDate = event?.startDate ? new Date(event.startDate) : event?.date ? new Date(event.date) : null;
  const endDate = event?.endDate ? new Date(event.endDate) : null;

  const handleBook = () => {
    if (!event?._id) return;
    bookEvent.mutate(event._id, {
      onSuccess: () => {
        toast.success('Booking successful!');
      },
      onError: (err: unknown) => {
        function hasMessage(e: unknown): e is { message: string } {
          return typeof e === 'object' && e !== null && 'message' in (e as Record<string, unknown>) && typeof (e as Record<string, unknown>).message === 'string';
        }
        const message = hasMessage(err) ? err.message : 'Booking failed';
        toast.error(message);
      },
    });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-20">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <EventSkeleton />
        <EventSkeleton />
      </div>
    </div>
  );
  if (error || !event) return <div className="text-center text-red-400 mt-20">Event not found.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center py-8 px-2">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8">
        {/* Left: Event image and info */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-zinc-900">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 z-10 bg-zinc-900/80 hover:bg-yellow-500 text-white hover:text-black rounded-full p-2 shadow-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            {/* Event image */}
            <img
              src={event.imageUrl || 'https://placehold.co/600x350/222/fff?text=Event+Image'}
              alt={event.title}
              className="w-full h-72 object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-2 px-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-700 text-yellow-200 px-3 py-1 rounded-full text-xs font-semibold">{event.category || 'Music'}</span>
              <span className="text-zinc-400 text-xs">#</span>
            </div>
            <h1 className="text-3xl font-extrabold text-yellow-400 mb-1 tracking-wide">{event.title}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-zinc-800 text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold">By {organizerName}</span>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex flex-col items-center">
                <span className="bg-zinc-800 text-yellow-200 px-2 py-1 rounded-full text-xs font-semibold mb-1">{startDate ? startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase() : ''}</span>
                <span className="text-lg font-bold">{startDate ? startDate.getDate() : ''}</span>
              </div>
              <div>
                <div className="text-yellow-200 font-semibold">
                  {startDate ? startDate.toLocaleDateString() : ''}
                  {endDate ? ` → ${endDate.toLocaleDateString()}` : ''}
                </div>
                <div className="text-zinc-400 text-sm">06:00 AM - 02:00 AM</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-zinc-300">{event.location || 'Simba Center'}</span>
              <a href="#" className="text-yellow-400 text-xs underline ml-2">View</a>
            </div>
          </div>
        </div>
        {/* Right: Price, About, Location, Organizer */}
        <div className="w-full lg:w-[420px] flex flex-col gap-6">
          {/* Price Panel */}
          <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-yellow-400 mb-2">Price</h2>
            <div className="flex items-center justify-between px-4 py-3 rounded-lg border-2 border-yellow-400 bg-zinc-800 font-semibold text-lg">
              <span>Ticket</span>
              <span className="font-bold">{event.price ? `${event.price.toLocaleString()} RWF` : 'Free'}</span>
            </div>
            <button
              className="mt-4 w-full bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-200 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSoldOut || bookEvent.isLoading}
              onClick={handleBook}
            >
              {isSoldOut ? 'Sold Out' : bookEvent.isLoading ? 'Booking...' : 'Book'}
            </button>
            {isSoldOut && <div className="text-xs text-red-400 mt-2">This event is sold out.</div>}
          </div>
          {/* About */}
          <div className="bg-zinc-900 rounded-2xl shadow-lg p-6">
            <h3 className="text-yellow-400 font-bold mb-2">About</h3>
            <p className="text-zinc-300 whitespace-pre-line">{event.description || 'No description provided.'}</p>
          </div>
          {/* Location */}
          <div className="bg-zinc-900 rounded-2xl shadow-lg p-6">
            <h3 className="text-yellow-400 font-bold mb-2">Location</h3>
            <div className="mb-2">
              {/* Placeholder map image */}
              <img src="https://placehold.co/400x120/222/fff?text=Map" alt="Map" className="rounded-lg w-full mb-2" />
              <div className="text-zinc-300">{event.location || 'Simba Center'}</div>
            </div>
          </div>
          {/* Organizer */}
          <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <img src="https://placehold.co/48x48/ff0000/fff?text=R" alt="Organizer" className="rounded-full w-12 h-12" />
            <div>
              <div className="text-yellow-400 font-bold">Organizer</div>
              <div className="text-zinc-200">{organizerName} {organizerUsername}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-16 text-center text-yellow-600 text-sm">
        &copy; 2025 Event Booking Platform
      </div>
    </div>
  );
} 