import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Events', to: '/admin' },
  { label: 'Bookings', to: '/admin/bookings' },
  { label: 'Analytics', to: '/admin/analytics' },
];

export default function AdminSidebar() {
  return (
    <aside className="h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col py-8 px-4 shadow-xl sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <span className="bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-2xl">A</span>
        <span className="font-extrabold text-yellow-400 text-2xl tracking-widest">Admin</span>
      </div>
      <nav className="flex flex-col gap-2 mt-4">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg transition-colors duration-150 ${
                isActive
                  ? 'bg-yellow-500 text-black shadow-lg'
                  : 'text-yellow-300 hover:bg-zinc-900 hover:text-yellow-400'
              }`
            }
            end={item.to === '/admin'}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex-1" />
      {/* Future: Add user info, settings, or logout here */}
    </aside>
  );
} 