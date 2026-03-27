import React from 'react';
import AdminLayout from '../AdminLayout';
import { PageHeader, Button } from '../../Components/common';

export default function ProductDetails({ product }) {
  return (
    <AdminLayout title="Product Details">
      <div className="w-full max-w-md mx-auto">
        <PageHeader title={product.name} subtitle={`$${Number(product.price).toFixed(2)} • ${product.category.name}`} icon={'products'} />
        <div className="bg-white shadow rounded p-6">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <p><span className="font-semibold">Price:</span> ${product.price}</p>
          <p><span className="font-semibold">Stock:</span> {product.stock}</p>
          <p><span className="font-semibold">Category:</span> {product.category.name}</p>
          <p className="mt-2">{product.description}</p>
          <Button onClick={() => window.history.back()} className="mt-4" >Back</Button>
        </div>
      </div>
    </AdminLayout>
  );
}