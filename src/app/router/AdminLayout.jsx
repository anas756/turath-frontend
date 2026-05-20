import React from 'react';
import SaidBar from '../../components/admin/SaidBar';
import { Outlet } from 'react-router-dom';
import Footer from '../../components/admin/Footer';
import AlertBanner from '../../components/AlertBanner';

export default function AdminLayout() {
  return (
    <div>
      <SaidBar />
    
      <Outlet />
      <Footer />
    </div>
  );
}
