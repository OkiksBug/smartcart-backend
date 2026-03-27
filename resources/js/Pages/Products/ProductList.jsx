import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '../AdminLayout';
import { ConfirmModal, NotificationModal, PageHeader, Button } from '../../Components/common';

export default function ProductList({ products }) {
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleCloseNotification = () => setNotification(null);

  return (
    <AdminLayout title="Products">
  <PageHeader
    title="Products"
    subtitle="Manage your product catalog"
    icon="products"
    action={(
      <Link href="/admin/products/create" className="inline-flex items-center gap-2">
        <Button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">＋ Add Product</Button>
      </Link>
    )}
  />
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-12 w-12 object-cover rounded" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-300 rounded flex items-center justify-center">No image</div>
                  )}
                </td>
                <td className="p-2 font-semibold">{p.name}</td>
                <td className="p-2">${Number(p.price || 0).toFixed(2)}</td>
                <td className="p-2">
                  <span className={Number(p.stock) > 10 ? 'text-green-600' : 'text-red-600'}>
                    {Number(p.stock)}
                  </span>
                </td>
                <td className="p-2">{p.category.name}</td>
                  <td className="p-2 flex gap-2">
                  <Link href={`/admin/products/${p.id}`} className="inline-block">
                    <Button className="px-3 py-1 text-sm">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => setDeleteId(p.id)} className="px-3 py-1 text-sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && <ConfirmModal id={deleteId} resource="products" close={() => setDeleteId(null)} />}
      {notification && 
        <NotificationModal 
          message={notification.message} 
          type={notification.type} 
          close={handleCloseNotification} 
        />
      }
    </AdminLayout>
  );
}