import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '../AdminLayout';
import { PageHeader } from '../../Components/common';

export default function UserList() {
  const { users } = usePage().props;

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadge = (role) => {
    const labels = {
      admin: '👨‍💼 Admin',
      staff: '👷 Staff',
      customer: '👤 Customer'
    };
    return labels[role] || role;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <PageHeader title="Users" subtitle="Manage customer accounts and user information" icon="users" />

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Joined Date</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-gray-600 text-sm">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
                        {getRoleBadge(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/admin/users/${user.id}`}
                        className="bg-teal-600 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* User Statistics */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-semibold text-2xl">{users.length}</p>
              <p className="text-green-700 text-sm mt-1">Total Customers</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-semibold text-2xl">{users.filter(u => u.role === 'staff').length}</p>
              <p className="text-blue-700 text-sm mt-1">Staff Members</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-800 font-semibold text-2xl">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-red-700 text-sm mt-1">Admins</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}