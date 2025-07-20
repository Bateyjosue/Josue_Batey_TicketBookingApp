import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Navigation() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log(user)

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    setDropdownOpen(false);
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        {/* Logo/Icon */}
        {(user?.role === 'admin' && (window.location.pathname.startsWith('/admin') || window.location.pathname === '/admin')) ? (
          <span className="flex items-center gap-2 cursor-not-allowed opacity-60">
            <span className="bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-2xl">E</span>
            <span className="font-extrabold text-yellow-400 text-2xl tracking-widest">TicketApp</span>
          </span>
        ) : (
          <Link to="/events" className="flex items-center gap-2">
            <span className="bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-2xl">E</span>
            <span className="font-extrabold text-yellow-400 text-2xl tracking-widest">TicketApp</span>
          </Link>
        )}
        {user?.role === 'admin' && window.location.pathname.startsWith('/admin/events') && (
          <Link
            to="/admin"
            className="ml-6 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
          >
            Admin Dashboard
          </Link>
        )}
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 bg-zinc-900 hover:bg-yellow-500 hover:text-black text-white px-4 py-2 rounded-full font-semibold transition-colors"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <span className="bg-yellow-700 text-yellow-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
            {user?.username ? user.username[0].toUpperCase() : 'U'}
          </span>
          <span>{user?.username || 'Account'}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg py-2 flex flex-col z-50">
            <div className="px-4 py-3 border-b border-zinc-800">
              <div className="font-bold text-yellow-400 text-lg">{user?.username || 'Account'}</div>
              <div className="text-zinc-300 text-sm">{user?.email || ''}</div>
            </div>
            {user?.role === 'admin' && (
              <button
                className="block px-4 py-2 text-sm text-zinc-800 hover:bg-yellow-100 w-full text-left"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/admin');
                }}
              >
                Dashboard
              </button>
            )}
            {user?.role === 'customer' && (
              <button
                className="block px-4 py-2 text-sm text-zinc-800 hover:bg-yellow-100 w-full text-left"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/dashboard');
                }}
              >
                Dashboard
              </button>
            )}
            <button
              className="px-4 py-2 text-left text-yellow-400 hover:bg-zinc-800 hover:text-yellow-300 transition-colors rounded-b-xl"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
} 