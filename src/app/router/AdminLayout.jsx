import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import '../../styles/admin.css';
import Sidebar from './../../components/admin/Sidebar';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-shell flex min-h-screen bg-[#0d0e12] text-slate-100">
      <button
        type="button"
        className="admin-menu-toggle"
        aria-label="Open admin navigation"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-scrim"
          aria-label="Close admin navigation"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="admin-main flex flex-1 flex-col overflow-x-hidden">
        <main className="admin-content flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
