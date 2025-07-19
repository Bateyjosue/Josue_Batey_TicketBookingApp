import React, { useState, useEffect } from 'react';
import type { AdminEvent } from './EventCardAdmin';

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<AdminEvent, '_id'>) => Promise<void> | void;
  initialValues?: Partial<Omit<AdminEvent, '_id'>>;
  loading?: boolean;
  error?: string | null;
}

const defaultValues = {
  title: '',
  description: '',
  location: '',
  date: '',
  capacity: 0,
  price: 0,
};

export default function EventFormModal({ open, onClose, onSubmit, initialValues, loading, error }: EventFormModalProps) {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues({ ...defaultValues, ...initialValues });
      setFormError(null);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: name === 'capacity' || name === 'price' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title || !values.description || !values.location || !values.date) {
      setFormError('All fields are required.');
      return;
    }
    setFormError(null);
    await onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-zinc-950 rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto flex flex-col gap-6 relative border-2 border-yellow-700">
        <button
          className="absolute top-4 right-4 text-zinc-400 hover:text-yellow-400 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
          disabled={loading}
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold text-yellow-400 mb-2 text-center">{initialValues ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="title"
            className="bg-zinc-900 text-white border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
            placeholder="Title"
            value={values.title}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <textarea
            name="description"
            className="bg-zinc-900 text-white border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400 min-h-[80px]"
            placeholder="Description"
            value={values.description}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <input
            name="location"
            className="bg-zinc-900 text-white border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
            placeholder="Location"
            value={values.location}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <input
            name="date"
            type="datetime-local"
            className="bg-zinc-900 text-white border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
            placeholder="Date"
            value={values.date}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <div className="flex gap-2">
            <input
              name="capacity"
              type="number"
              min={1}
              className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
              placeholder="Capacity"
              value={values.capacity}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <input
              name="price"
              type="number"
              min={0}
              className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
              placeholder="Price"
              value={values.price}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          {(formError || error) && <div className="text-red-400 text-center text-sm">{formError || error}</div>}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-200 text-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialValues ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
} 