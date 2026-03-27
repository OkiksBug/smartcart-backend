import React from 'react';
import AdminLayout from '../AdminLayout';
import { Button } from '../../Components/common';
import { Link } from '@inertiajs/inertia-react';

function initial(name) {
  if (!name) return 'A';
  return name.charAt(0).toUpperCase();
}

function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d;
  }
}

export default function AdminProfileView({ user = {} }) {
  const stats = {
    orders: user.total_orders || 0,
    reviews: user.total_reviews || 0,
    products: user.total_products || 0,
  };

  const recent = user.recent_activity || user.recent_orders || [];

  return (
    <AdminLayout title="Profile">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-6">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img src={`/storage/${user.avatar}`} className="w-28 h-28 object-cover rounded-full shadow-sm" alt="avatar" />
            ) : (
              <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-extrabold text-gray-600">{initial(user.name)}</div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Admin'}</h1>
              <p className="text-sm text-gray-600">{user?.email || '—'}</p>
              <div className="mt-3 flex items-center gap-3">
                <Link href="/admin/profile" className="inline-block bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded">Edit Profile</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: About & contact */}
          <div className="col-span-2 bg-gray-50 p-6 rounded">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-sm text-gray-700 mb-4">{user?.bio || 'Welcome! This is your admin profile where you can manage your account details, view activity, and access quick actions.'}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-xs text-gray-500 uppercase">Role</h3>
                <p className="text-sm text-gray-800">{user?.role || 'Administrator'}</p>
              </div>
              <div>
                <h3 className="text-xs text-gray-500 uppercase">Last Login</h3>
                <p className="text-sm text-gray-800">{formatDate(user?.last_login)}</p>
              </div>
            </div>

            <h3 className="text-sm font-medium mb-2">Contact</h3>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${user?.email}`} className="text-sm text-teal-600">{user?.email}</a>
              {user?.phone && <span className="text-sm text-gray-700">{user.phone}</span>}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
              {recent.length > 0 ? (
                <ul className="space-y-2">
                  {recent.slice(0, 6).map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 bg-white p-3 rounded shadow-sm">
                      <div className="flex justify-between">
                        <div className="font-medium text-gray-900">{r.title || r.action || r.type || 'Activity'}</div>
                        <div className="text-xs text-gray-500">{formatDate(r.created_at || r.date)}</div>
                      </div>
                      {r.note && <div className="text-xs text-gray-600 mt-1">{r.note}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No recent activity to show.</p>
              )}
            </div>
          </div>

          {/* Right column: Stats & quick actions */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-xs text-gray-500">Orders processed</h4>
                <div className="mt-2 text-2xl font-bold text-gray-900">{stats.orders}</div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-xs text-gray-500">Products managed</h4>
                <div className="mt-2 text-2xl font-bold text-gray-900">{stats.products}</div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-xs text-gray-500">Reviews</h4>
                <div className="mt-2 text-2xl font-bold text-gray-900">{stats.reviews}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="text-sm font-medium mb-2">Quick actions</h4>
              <div className="flex flex-col gap-2">
                <Link href="/admin/orders" className="block text-left bg-teal-50 hover:bg-teal-100 text-teal-700 py-2 px-3 rounded">View orders</Link>
                <Link href="/admin/products" className="block text-left bg-gray-50 hover:bg-gray-100 text-gray-800 py-2 px-3 rounded">Manage products</Link>
                <Link href="/admin/settings" className="block text-left bg-gray-50 hover:bg-gray-100 text-gray-800 py-2 px-3 rounded">Account settings</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
