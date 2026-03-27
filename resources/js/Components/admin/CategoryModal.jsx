import React, { useState } from 'react';
import CategoryForm from '../../Pages/Categories/CategoryForm';
import { Button } from '../common';

export default function CategoryModal({ type, category }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className={type==='create' ? 'px-4 py-2' : 'px-2 py-1'}>
        {type==='create' ? 'Add Category' : 'Edit'}
      </Button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">{type==='create' ? 'Add Category' : 'Edit Category'}</h2>
            <CategoryForm type={type} category={category} closeModal={()=>setOpen(false)} />
            <Button variant="secondary" onClick={()=>setOpen(false)} className="mt-4">Close</Button>
          </div>
        </div>
      )}
    </>
  );
}