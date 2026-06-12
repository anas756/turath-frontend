import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import '../../styles/user.css';

export default function UserLayout() {
  return (
    <div className="user-shell">
      <Navbar />

      <main className="user-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
