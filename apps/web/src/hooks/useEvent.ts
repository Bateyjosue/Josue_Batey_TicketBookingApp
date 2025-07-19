import { useQuery } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export function useEvent(eventId: string | undefined) {
  return useQuery(['event', eventId], async () => {
    if (!eventId) throw new Error('No event ID provided');
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/v1/events/${eventId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to fetch event');
    return res.json();
  }, {
    enabled: !!eventId,
  });
} 