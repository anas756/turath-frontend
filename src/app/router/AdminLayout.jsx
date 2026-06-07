import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../styles/admin.css';
import Sidebar from './../../components/admin/Sidebar';

export default function AdminLayout() {
  return (
    <div className="admin-shell flex min-h-screen bg-[#0d0e12] text-slate-100">
      <Sidebar />
      <div className="admin-main flex flex-1 flex-col overflow-x-hidden">
        <main className="admin-content flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
