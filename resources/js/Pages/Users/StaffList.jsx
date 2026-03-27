import React from 'react';
import AdminLayout from '../AdminLayout';
import { PageHeader, Button } from '../../Components/common';
import { usePage } from '@inertiajs/inertia-react';

export default function StaffList() {
  const { users } = usePage().props; // staff users

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
       
          <PageHeader
            title="Staff Members"
            subtitle="Manage staff accounts and assignments"
            icon={'users'}
            action={(
              <a href="/admin/users/staff/create" className="inline-flex items-center gap-2">
                <Button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">＋ Create Staff</Button>
              </a>
            )}
          />
       

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <a href={`/admin/staff/${user.id}`} className="bg-teal-600 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm">View</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No staff found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
