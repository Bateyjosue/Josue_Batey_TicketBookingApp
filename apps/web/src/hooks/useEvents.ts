import { useQuery } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export interface EventsFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
  minCapacity?: string;
  maxCapacity?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  pageSize?: number;
}

function buildQueryString(params: EventsFilter) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.minCapacity) query.append('minCapacity', params.minCapacity);
  if (params.maxCapacity) query.append('maxCapacity', params.maxCapacity);
  if (params.minPrice) query.append('minPrice', params.minPrice);
  if (params.maxPrice) query.append('maxPrice', params.maxPrice);
  if (params.page) query.append('page', params.page.toString());
  if (params.pageSize) query.append('pageSize', params.pageSize.toString());
  return query.toString();
}

export function useEvents(filters: EventsFilter = {}) {
  return useQuery(['events', filters], async () => {
    const token = localStorage.getItem('token');
    const queryString = buildQueryString(filters);
    const res = await fetch(`${BASE_URL}/api/v1/events${queryString ? `?${queryString}` : ''}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  });
}
