import { useQuery } from '@tanstack/react-query';

export function useEvents() {
  return useQuery(['events'], async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/v1/events', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  });
}
