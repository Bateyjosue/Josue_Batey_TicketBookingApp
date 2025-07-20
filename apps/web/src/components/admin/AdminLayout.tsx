import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar for desktop, drawer for mobile */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-60 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 shadow-xl" onClick={e => e.stopPropagation()}>
          <AdminSidebar />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Hamburger menu for mobile */}
        <div className="md:hidden p-4 flex items-center">
          <button
            className="text-yellow-400 text-3xl focus:outline-none mr-4"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            &#9776;
          </button>
          <span className="text-yellow-400 text-xl font-bold">{title}</span>
        </div>
        {/* Title for desktop */}
        <div className="hidden md:block text-yellow-400 text-2xl font-bold px-8 pt-8">{title}</div>
        <main className="flex-1 p-4 md:p-8 bg-black overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 