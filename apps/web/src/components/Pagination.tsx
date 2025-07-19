import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
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
  );
} 