import React from 'react';

export default function AdminTopbar({ title = 'Dashboard' }: { title?: string }) {
  return (
    <header className="w-full h-20 flex items-center justify-between px-8 bg-zinc-900 border-b border-zinc-800 shadow-md sticky top-0 z-30">
      <h1 className="text-2xl font-extrabold text-yellow-400 tracking-wide">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Placeholder for user info, notifications, etc. */}
        <span className="bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-xl">A</span>
        <span className="text-yellow-200 font-semibold">Admin User</span>
      </div>
    </header>
  );
} 