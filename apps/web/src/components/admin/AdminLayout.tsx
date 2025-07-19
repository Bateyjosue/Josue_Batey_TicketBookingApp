import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {title}
        <main className="flex-1 p-8 bg-black overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 