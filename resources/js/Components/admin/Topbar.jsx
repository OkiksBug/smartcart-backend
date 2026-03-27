import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import Button from '../common/Button'; // Ensure import of Button component

export default function Topbar({ title }) {
  const { auth } = usePage().props;

  const logout = () => {
    Inertia.post('/admin/logout');
  }

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>
        <Button variant="danger" onClick={logout}>Logout</Button>
    </header>
  );
}