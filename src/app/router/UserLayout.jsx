import React from 'react'
import Navbar from '../../components/user/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/user/Footer'

export default function UserLayout() {
  return (
      <div>
          <Navbar />
          <Outlet />
          <Footer/>
      
    </div>
  )
}
