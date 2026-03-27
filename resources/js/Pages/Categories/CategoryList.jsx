import React from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../AdminLayout';
import { PageHeader, Button } from '../../Components/common';

export default function CategoryList() {
    const { categories } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            Inertia.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto">
                                
                                        <PageHeader
                                            title="Categories"
                                            subtitle="Manage product categories"
                                            icon={'products'}
                                            action={(
                                                <a href="/admin/categories/create" className="inline-flex items-center gap-2">
                                                    <Button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">＋ Add Category</Button>
                                                </a>
                                            )}
                                        />
                                

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Assigned Staff</th>
                                <th className="px-6 py-3 text-right font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-800">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-700">
                                                {category.assigned_staff?.name ||
                                                    category.assignedStaff?.name ||
                                                    'No staff assigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <a href={`/admin/categories/${category.id}/edit`} className="inline-block">
                                                <Button className="py-1 px-3 text-sm">Edit</Button>
                                            </a>
                                            <Button variant="danger" onClick={() => handleDelete(category.id)} className="py-1 px-3 text-sm">Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}