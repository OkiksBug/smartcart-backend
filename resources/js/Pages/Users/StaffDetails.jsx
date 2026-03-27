import React from 'react';
import AdminLayout from '../AdminLayout';
import { PageHeader } from '../../Components/common';
import { usePage } from '@inertiajs/react';

export default function StaffDetails() {
  const { user } = usePage().props;

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <PageHeader title={user.name} subtitle="Staff account information" icon={'users'} />
          <div className="mt-2">
            <a href="/admin/staff" className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg font-medium transition">Back to Staff</a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="grid grid-cols-2 gap-8">
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
                <p className="text-gray-900 font-semibold mt-1">{user.role}</p>
              </div>
            </div>

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
      </div>
    </AdminLayout>
  );
}
