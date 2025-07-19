import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
// import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import type { Event } from '../components/EventCard';

function EventSkeleton() {
  return (
    <div className="animate-pulse bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-yellow-700 rounded-2xl shadow-xl p-6 flex flex-col justify-between min-h-[260px]">
      <div className="h-6 bg-zinc-800 rounded w-2/3 mb-4" />
      <div className="h-4 bg-zinc-800 rounded w-1/3 mb-2" />
      <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2" />
      <div className="h-4 bg-zinc-800 rounded w-1/4 mb-4" />
      <div className="h-12 bg-zinc-800 rounded w-full mb-4" />
      <div className="h-10 bg-yellow-900 rounded w-1/2 self-center" />
    </div>
  );
}

const PAGE_SIZE = 9;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function EventsListPage() {
  // Filter state
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const { data: allEvents, isLoading, error } = useEvents(); // fetch all events
  // const navigate = useNavigate();

  // Filter and search in the frontend
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(allEvents)) return [];
    return allEvents.filter(event => {
      // Search by name or location
      const searchMatch = debouncedSearch
        ? (event.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
           event.location?.toLowerCase().includes(debouncedSearch.toLowerCase()))
        : true;
      // Date range
      const eventDate = event.date ? new Date(event.date) : null;
      const startMatch = startDate ? (eventDate && eventDate >= new Date(startDate)) : true;
      const endMatch = endDate ? (eventDate && eventDate <= new Date(endDate)) : true;
      // Capacity range
      const minCapMatch = minCapacity ? event.capacity >= Number(minCapacity) : true;
      const maxCapMatch = maxCapacity ? event.capacity <= Number(maxCapacity) : true;
      // Price range
      const minPriceMatch = minPrice ? event.price >= Number(minPrice) : true;
      const maxPriceMatch = maxPrice ? event.price <= Number(maxPrice) : true;
      return searchMatch && startMatch && endMatch && minCapMatch && maxCapMatch && minPriceMatch && maxPriceMatch;
    });
  }, [allEvents, debouncedSearch, startDate, endDate, minCapacity, maxCapacity, minPrice, maxPrice]);

  // Pagination
  const total = filteredEvents.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pagedEvents = filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [debouncedSearch, startDate, endDate, minCapacity, maxCapacity, minPrice, maxPrice]);

  function resetFilters() {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setMinCapacity('');
    setMaxCapacity('');
    setMinPrice('');
    setMaxPrice('');
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar (desktop only) */}
      <aside className="w-80 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6 flex-col gap-8 sticky top-0 hidden md:flex">
        {/* Search */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Search</h2>
          <div className="flex items-center gap-0 mb-1">
            <input
              className="w-full bg-zinc-900 text-white border-none rounded-l-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
              placeholder="Search by name or location"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="bg-yellow-500 text-black px-4 py-3 rounded-r-xl font-bold hover:bg-yellow-600 transition-colors" onClick={() => setPage(1)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4-4m0 0A7 7 0 105 5a7 7 0 0012 12z" />
              </svg>
            </button>
          </div>
          <div className="text-zinc-400 text-xs mb-2">Results depend on active filters</div>
          <hr className="border-zinc-800 my-3" />
        </div>
        {/* Date */}
        <div>
          <h3 className="text-white font-semibold mb-2">Date</h3>
          <div className="flex gap-2 mb-2 w-full">
            <div className="flex flex-col items-start w-1/2">
              <span className="text-zinc-400 text-xs mb-1 ml-1">Starting</span>
              <input
                type="date"
                className="w-full bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start w-1/2">
              <span className="text-zinc-400 text-xs mb-1 ml-1">Ending</span>
              <input
                type="date"
                className="w-full bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="text-zinc-400 text-xs mb-2">Pick a selection of date ranges to filter by</div>
          <hr className="border-zinc-800 my-3" />
        </div>
        {/* Capacity */}
        <div>
          <h3 className="text-white font-semibold mb-2">Capacity</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              min="1"
              className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
              placeholder="Min"
              value={minCapacity}
              onChange={e => setMinCapacity(e.target.value)}
            />
            <input
              type="number"
              min="1"
              className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
              placeholder="Max"
              value={maxCapacity}
              onChange={e => setMaxCapacity(e.target.value)}
            />
          </div>
          <hr className="border-zinc-800 my-3" />
        </div>
        {/* Price */}
        <div>
          <h3 className="text-white font-semibold mb-2">Price</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              min="0"
              className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
          </div>
          <hr className="border-zinc-800 my-3" />
        </div>
        <button
          className="w-full mt-2 bg-zinc-800 text-yellow-400 font-bold py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </aside>
      {/* Top bar for mobile */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40">
        <button
          className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 ${showFilterModal ? 'border-yellow-500' : 'border-zinc-800'} bg-zinc-900 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
          onClick={() => setShowFilterModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M6.75 9.75v4.5m0 0c0 2.485 2.015 4.5 4.5 4.5s4.5-2.015 4.5-4.5m-9 0h9" />
          </svg>
        </button>
        <input
          className="flex-1 bg-zinc-900 text-white border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
          placeholder="Search by name or location"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="bg-yellow-500 text-black px-4 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors ml-2" onClick={() => setPage(1)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4-4m0 0A7 7 0 105 5a7 7 0 0012 12z" />
          </svg>
        </button>
      </div>
      {/* Filter Modal (mobile) */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-zinc-950 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto flex flex-col gap-6 relative">
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-yellow-400 text-2xl font-bold"
              onClick={() => setShowFilterModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Date */}
            <div>
              <h3 className="text-white font-semibold mb-2">Date</h3>
              <div className="flex gap-2 mb-2 w-full">
                <div className="flex flex-col items-start w-1/2">
                  <span className="text-zinc-400 text-xs mb-1 ml-1">Starting</span>
                  <input
                    type="date"
                    className="w-full bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-start w-1/2">
                  <span className="text-zinc-400 text-xs mb-1 ml-1">Ending</span>
                  <input
                    type="date"
                    className="w-full bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Capacity */}
            <div>
              <h3 className="text-white font-semibold mb-2">Capacity</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  min="1"
                  className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
                  placeholder="Min"
                  value={minCapacity}
                  onChange={e => setMinCapacity(e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
                  placeholder="Max"
                  value={maxCapacity}
                  onChange={e => setMaxCapacity(e.target.value)}
                />
              </div>
            </div>
            {/* Price */}
            <div>
              <h3 className="text-white font-semibold mb-2">Price</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  min="0"
                  className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  className="w-1/2 bg-zinc-900 text-white border-none rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-zinc-400"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <button
              className="w-full mt-4 bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-200 text-lg"
              onClick={() => setShowFilterModal(false)}
            >
              Apply Filters
            </button>
            <button
              className="w-full mt-2 bg-zinc-800 text-yellow-400 font-bold py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
      {/* Main content */}
      <main className="flex-1 py-12 px-4">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-10 text-center tracking-wide">Upcoming Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <EventSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full text-center text-yellow-200">Failed to load events.</div>
          ) : pagedEvents.length > 0 ? pagedEvents.map((event: Event) => (
            <EventCard key={event._id} event={event} />
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-yellow-700 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m10.5 0v10.125c0 1.012-.838 1.875-1.875 1.875H7.125A1.875 1.875 0 015.25 19.125V9m13.5 0H5.25m13.5 0a2.25 2.25 0 012.25 2.25v7.125c0 1.012-.838 1.875-1.875 1.875H7.125A1.875 1.875 0 015.25 19.125V11.25A2.25 2.25 0 017.5 9h9a2.25 2.25 0 012.25 2.25V9z" />
              </svg>
              <div className="text-yellow-300 text-xl font-bold mb-2">No events found</div>
              <div className="text-zinc-400 text-sm">Try adjusting your search or filter criteria.</div>
            </div>
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              className="px-4 py-2 rounded bg-zinc-800 text-yellow-400 font-bold hover:bg-yellow-700 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded font-bold ${page === i + 1 ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-yellow-400 hover:bg-yellow-700'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded bg-zinc-800 text-yellow-400 font-bold hover:bg-yellow-700 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 