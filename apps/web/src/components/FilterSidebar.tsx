interface FilterSidebarProps {
  search: string;
  setSearch: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  minCapacity: string;
  setMinCapacity: (v: string) => void;
  maxCapacity: string;
  setMaxCapacity: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  resetFilters: () => void;
}

export default function FilterSidebar({
  search, setSearch,
  startDate, setStartDate,
  endDate, setEndDate,
  minCapacity, setMinCapacity,
  maxCapacity, setMaxCapacity,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  resetFilters
}: FilterSidebarProps) {
  return (
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
          <button className="bg-yellow-500 text-black px-4 py-3 rounded-r-xl font-bold hover:bg-yellow-600 transition-colors">
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
  );
} 