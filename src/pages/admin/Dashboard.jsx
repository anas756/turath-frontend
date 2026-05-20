import React from 'react';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      <h1>welcom back {{ user }}</h1>
    </div>
  );
}
