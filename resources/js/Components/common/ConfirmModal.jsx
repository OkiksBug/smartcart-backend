// resources/js/Components/common/ConfirmModal.jsx
import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Button } from './index';

export default function ConfirmModal({ id, resource, close, title = 'Confirm Delete' }) {
  const handleDelete = () => {
    Inertia.delete(`/admin/${resource}/${id}`, {
      onSuccess: () => close(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded bg-red-100 text-red-700 flex items-center justify-center">!</div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="text-gray-700">Are you sure you want to delete this {resource}?</p>
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
}