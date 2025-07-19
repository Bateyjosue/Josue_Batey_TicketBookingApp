import React from 'react';

interface EventDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
  loading?: boolean;
  error?: string | null;
}

export default function EventDeleteDialog({ open, onClose, onConfirm, eventTitle, loading, error }: EventDeleteDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-zinc-950 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto flex flex-col gap-6 relative border-2 border-yellow-700">
        <button
          className="absolute top-4 right-4 text-zinc-400 hover:text-yellow-400 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
          disabled={loading}
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold text-yellow-400 mb-2 text-center">Delete Event</h2>
        <div className="text-yellow-200 text-lg text-center mb-4">
          Are you sure you want to <span className="text-red-400 font-bold">delete</span> the event <span className="font-bold">{eventTitle}</span>?
        </div>
        {error && <div className="text-red-400 text-center text-sm">{error}</div>}
        <div className="flex gap-4 justify-center mt-4">
          <button
            className="px-6 py-2 rounded-lg font-bold bg-zinc-800 text-yellow-400 hover:bg-yellow-700 transition-colors disabled:opacity-60"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
} 