export interface AdminEvent {
  _id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  description: string;
}

interface EventCardAdminProps {
  event: AdminEvent;
  onEdit?: (event: AdminEvent) => void;
  onDelete?: (event: AdminEvent) => void;
  onViewBookings?: (event: AdminEvent) => void;
}

export default function EventCardAdmin({ event, onEdit, onDelete, onViewBookings }: EventCardAdminProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-yellow-700 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">{event.title}</h2>
        <div className="mb-2 text-yellow-200 font-semibold">{new Date(event.date).toLocaleString()}</div>
        <div className="mb-2 text-yellow-100">{event.location}</div>
        <div className="mb-4 text-yellow-400 font-bold">{event.price ? `${event.price.toLocaleString()} RWF` : 'Free'}</div>
        <p className="text-zinc-300 mb-4 min-h-[60px]">{event.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4 gap-2">
        <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-xs" onClick={() => onEdit?.(event)}>Edit</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors text-xs" onClick={() => onDelete?.(event)}>Delete</button>
        <button className="bg-zinc-800 text-yellow-400 px-4 py-2 rounded-lg font-bold hover:bg-yellow-700 transition-colors text-xs" onClick={() => onViewBookings?.(event)}>View Bookings</button>
      </div>
    </div>
  );
} 