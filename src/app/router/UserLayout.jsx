import React from 'react';
import { Outlet } from 'react-router-dom';
import AIChatbot from '../../components/user/AIChatbot';
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

      <AIChatbot />
      <Footer />
    </div>
  );
}
