import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar() {
  const { auth, currentRoute } = usePage().props;

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Staff', href: '/admin/staff' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold">SC</div>
        <div>
          <div className="font-bold text-lg">SmartCart</div>
          <div className="text-xs text-gray-500">Admin</div>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`block py-2 px-3 rounded-md hover:bg-teal-50 transition-colors ${
              currentRoute === item.href ? 'bg-teal-100 text-teal-700 font-semibold' : 'text-gray-700'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
