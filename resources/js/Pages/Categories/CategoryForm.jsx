import React from 'react';
import { usePage, useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../AdminLayout';
import { PageHeader, Button } from '../../Components/common';

export default function CategoryForm() {
    const { category, staffs = [] } = usePage().props;
    const isEditing = !!category?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        assigned_staff_id: category?.assigned_staff_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            // Use PUT so Laravel receives proper HTTP verb for update
            put(`/admin/categories/${category.id}`, data);
        } else {
            post('/admin/categories', data);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-xl mx-auto">
                <PageHeader title={isEditing ? 'Edit Category' : 'Create Category'} subtitle={isEditing ? 'Modify category details' : 'Add a new product category'} icon={'products'} />
                <div className="bg-white p-8 rounded-lg shadow">

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter category name"
                            required
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">{errors.name}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Assign Staff *
                        </label>
                        <select
                            value={data.assigned_staff_id}
                            onChange={(e) => setData('assigned_staff_id', e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select staff</option>
                            {staffs.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name}
                                </option>
                            ))}
                        </select>

                        {errors.assigned_staff_id && (
                            <span className="text-red-500 text-sm">{errors.assigned_staff_id}</span>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={processing} className="w-full">{processing ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}</Button>

                        <Button variant="secondary" type="button" className="w-full" onClick={() => Inertia.get('/admin/categories')}>Cancel</Button>
                    </div>
                </form>
            </div>
            </div>
        </AdminLayout>
    );
}