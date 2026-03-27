import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '../AdminLayout';
import { PageHeader } from '../../Components/common';

export default function UserDetails() {
  const { user } = usePage().props;

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <PageHeader title={user.name} subtitle="User account information" icon="users" />
          <div className="mt-2">
            <a
              href="/admin/users"
              className="bg-teal-600 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-medium transition"
            >
              Back to Users
            </a>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Name</p>
                <p className="text-gray-900 font-semibold mt-1">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Email</p>
                <p className="text-gray-900 font-semibold mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Role</p>
                <div className="mt-1">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
                    {getRoleBadge(user.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Account Created</p>
                <p className="text-gray-900 font-semibold mt-1">{formatDate(user.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Last Updated</p>
                <p className="text-gray-900 font-semibold mt-1">{formatDate(user.updated_at)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">User ID</p>
                <p className="text-gray-900 font-semibold mt-1">#{user.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-2xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-blue-900">Account Status</h3>
              <p className="text-blue-800 text-sm mt-1">
                This is an active {user.role} account. All permissions are active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}