import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Events', to: '/admin/events' },
];

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col py-8 px-4 shadow-xl z-30">
      <nav className="flex flex-col gap-2 mt-4">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg transition-colors duration-150 ${
              isActive
                ? 'bg-yellow-500 text-black shadow-lg'
                : 'text-yellow-300 hover:bg-zinc-900 hover:text-yellow-400'
            }`
          }
          end={true}
        >
          Dashboard
        </NavLink>
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
            end={item.to === '/admin/events'}
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