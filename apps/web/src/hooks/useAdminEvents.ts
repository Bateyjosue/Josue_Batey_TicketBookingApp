import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminEvent } from '../components/admin/EventCardAdmin';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: Omit<AdminEvent, '_id'>) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create event');
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events']);
      },
    }
  );
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...data }: { id: string } & Omit<AdminEvent, '_id'>) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update event');
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events']);
      },
    }
  );
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to delete event');
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events']);
      },
    }
  );
} 