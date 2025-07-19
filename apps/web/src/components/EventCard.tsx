import { Link, useNavigate } from 'react-router-dom';

export type Event = {
  _id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  description: string;
  capacity: number;
  bookedCount?: number;
  // add other fields as needed
};

interface EventCardProps {
  event: Event;
  onBook?: (event: Event) => void;
  disabled?: boolean;
  booked?: boolean;
}

export default function EventCard({ event, onBook, disabled = false, booked = false }: EventCardProps) {
  const navigate = useNavigate();
  const remaining = typeof event.capacity === 'number' && typeof event.bookedCount === 'number'
    ? event.capacity - event.bookedCount
    : undefined;

  return (
    <div
      className={`group ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}
    >
      <Link
        to={disabled ? '#' : `/events/${event._id}`}
        className="block"
        tabIndex={disabled ? -1 : 0}
        onClick={e => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          // Prevent navigation if onBook is used
          if (onBook) e.preventDefault();
        }}
      >
        <div className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-yellow-700 rounded-2xl shadow-xl p-6 flex flex-col justify-between group-hover:scale-105 transition-transform duration-200 cursor-pointer">
          {typeof remaining === 'number' && (
            <span className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
              {remaining} left
            </span>
          )}
          <div>
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">{event.title}</h2>
            <div className="mb-2 text-yellow-200 font-semibold">{new Date(event.date).toLocaleString()}</div>
            <div className="mb-2 text-yellow-100">{event.location}</div>
            <div className="mb-4 text-yellow-400 font-bold">${event.price.toFixed(2)}</div>
            <p className="text-zinc-300 mb-4 min-h-[60px]">{event.description}</p>
          </div>
          <button
            className="mt-2 w-full bg-yellow-500 text-black font-bold py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={e => {
              e.preventDefault();
              if (disabled) return;
              if (onBook) onBook(event);
              else navigate(`/events/${event._id}`);
            }}
            disabled={disabled || booked}
          >
            {disabled ? 'Unavailable' : booked ? 'Already Booked' : 'Book'}
          </button>
        </div>
      </Link>
    </div>
  );
} 