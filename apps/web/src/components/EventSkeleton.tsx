import React from 'react';

export default function EventSkeleton() {
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