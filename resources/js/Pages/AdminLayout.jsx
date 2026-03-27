import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import NotificationsListModal from '../Components/common/NotificationsListModal';
import { Button } from '../Components/common';
import axios from 'axios';

export default function AdminLayout({ children, title = "Admin Dashboard" }) {
  const { auth, currentRoute } = usePage().props;
  const flash = usePage().props.flash || {};

  const [showFlash, setShowFlash] = useState(Boolean(flash.success));
  useEffect(() => {
    setShowFlash(Boolean(flash.success));
  }, [flash.success]);

  const logout = () => {
    Inertia.post('/admin/logout');
  }

  const [showNotifications, setShowNotifications] = useState(false);
  const sharedNotifications = usePage().props.notifications || { items: [], unseen_count: 0 };
  const [items, setItems] = useState(sharedNotifications.items || []);
  const [unseenCount, setUnseenCount] = useState(sharedNotifications.unseen_count || 0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const openNotifications = async () => {
    setShowNotifications(true);
    try {
      const ids = items.filter(i => !i.is_seen).map(i => i.id);
      if (ids.length > 0) {
        await axios.post('/admin/notifications/mark-seen', { ids });
        setUnseenCount(Math.max(0, unseenCount - ids.length));
        setItems(prev => prev.map(it => ({ ...it, is_seen: true })));
      }
    } catch (e) {
      console.error('Failed to mark notifications seen', e);
    }
  };

  // themed links with simple SVG icons (inline to avoid new deps)
  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: (
      <svg className="w-5 h-5 mr-3 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
      </svg>
    )},
    { name: 'Products', href: '/admin/products', icon: (
      <svg className="w-5 h-5 mr-3 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2h-6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H6a2 2 0 00-2 2v6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9 5 9-5-9-5-9 5z" />
      </svg>
    )},
    { name: 'Categories', href: '/admin/categories', icon: (
      <svg className="w-5 h-5 mr-3 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )},
    { name: 'Orders', href: '/admin/orders', icon: (
      <svg className="w-5 h-5 mr-3 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21a1 1 0 100-2 1 1 0 000 2zM8 21a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    )},
    { name: 'Users', href: '/admin/users', icon: (
      <svg className="w-5 h-5 mr-3 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20H4v-2a4 4 0 014-4h1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    )},
    { name: 'Staff', href: '/admin/staff', icon: (
      <svg className="w-5 h-5 mr-3 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      </svg>
    )},
    { name: 'Profile', href: '/admin/profile/view', icon: (
      <svg className="w-5 h-5 mr-3 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { name: 'Settings', href: '/admin/profile', icon: (
      <svg className="w-5 h-5 mr-3 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
      </svg>
    )},
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold">SC</div>
          <div>
            <div className="font-bold text-lg">SmartCart</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center py-2 px-3 rounded-md hover:bg-teal-50 transition-colors ${
                currentRoute === link.href ? 'bg-teal-100 text-teal-700 font-semibold' : 'text-gray-700'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <div className="hidden md:block">
              <input
                type="search"
                placeholder="Search..."
                className="px-3 py-1 rounded-md border border-gray-200 focus:border-teal-300 focus:ring focus:ring-teal-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
              <Button onClick={openNotifications} variant="ghost" className="relative p-2" title="Notifications">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6L18 14V9a6 6 0 00-5-5.917V3a2 2 0 10-4 0v.083A6 6 0 004 9v5l-.6.6a2.032 2.032 0 01-.395 1.0L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unseenCount}</span>
                )}
              </Button>

            <div className="flex items-center gap-3">
              <Link href="/admin/profile/view" className="text-sm text-gray-700 hover:underline">{auth?.user?.name || 'Admin'}</Link>
              <Button variant="danger" onClick={logout} className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md">Logout</Button>
            </div>
          </div>
        </header>

        {/* Flash messages (success) */}
        {showFlash && flash.success && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="text-sm">{flash.success}</div>
                </div>
                <button onClick={() => setShowFlash(false)} className="text-green-600 hover:text-green-800">✕</button>
              </div>
            </div>
          </div>
        )}

        <main className="p-6 flex-1 bg-gray-50">{children}</main>
      </div>

  <NotificationsListModal
    show={showNotifications}
    onClose={() => setShowNotifications(false)}
    initialItems={items}
    loadMoreUrl="/admin/notifications"
    onLoadMore={(newItems, more) => { setItems(prev => [...prev, ...newItems]); setHasMore(more); }}
  />
    </div>
  );
}