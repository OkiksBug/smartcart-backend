import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../AdminLayout';
import { PageHeader, Button } from '../../Components/common';

export default function OrderDetails() {
    const { order, staffs = [] } = usePage().props;
    const [showAssignStaff, setShowAssignStaff] = useState(false);
    const [showUpdateStatus, setShowUpdateStatus] = useState(false);

    const { data, setData, post, processing } = useForm({
        staff_id: order?.assigned_staff_id || '',
        status: order?.status || 'Pending',
    });

    const handleAssignStaff = (e) => {
        e.preventDefault();
        post(`/admin/orders/${order.id}/assign-staff`, {
            onSuccess: () => setShowAssignStaff(false),
        });
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        post(`/admin/orders/${order.id}/update-status`, {
            onSuccess: () => setShowUpdateStatus(false),
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this order?')) {
            Inertia.delete(`/admin/orders/${order.id}`, {
                onSuccess: () => window.location.href = '/admin/orders',
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(price || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-start justify-between mb-8">
                    <PageHeader title={`Order #${order.id}`} subtitle={`Order placed ${formatDate(order.created_at)}`} icon={'orders'} />
                    <div className="mt-2 flex gap-2">
                        <a
                            href="/admin/orders"
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-medium transition"
                        >
                            Back to Orders
                        </a>
                        <Button variant="danger" onClick={handleDelete} className="px-6">Delete Order</Button>
                    </div>
                </div>

                {/* Status and Overview */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600 text-sm font-medium">Status</p>
                        <div className="mt-2">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                            <Button variant="secondary" onClick={() => setShowUpdateStatus(!showUpdateStatus)} className="block mt-3 text-sm">Update Status</Button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {formatPrice(order.total_price)}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600 text-sm font-medium">Items</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {order.items?.length || 0}
                        </p>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600 text-sm">Customer Name</p>
                            <p className="text-gray-900 font-semibold mt-1">{order.user?.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Email</p>
                            <p className="text-gray-900 font-semibold mt-1">{order.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Assigned Staff */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Assigned Staff</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {order.assigned_staff?.name ? (
                                    <>
                                        <span className="font-semibold text-gray-900">{order.assigned_staff.name}</span>
                                        <span className="text-gray-500"> ({order.assigned_staff.email})</span>
                                    </>
                                ) : (
                                    <span className="text-gray-400 italic">No staff assigned</span>
                                )}
                            </p>
                        </div>
                        <Button onClick={() => setShowAssignStaff(!showAssignStaff)} className="px-4">{order.assigned_staff ? 'Change Staff' : 'Assign Staff'}</Button>
                    </div>

                    {/* Assign Staff Form */}
                    {showAssignStaff && (
                        <form onSubmit={handleAssignStaff} className="mt-6 pt-6 border-t">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Select Staff</label>
                                    <select
                                        value={data.staff_id}
                                        onChange={(e) => setData('staff_id', e.target.value)}
                                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Choose a staff member</option>
                                        {staffs.map((staff) => (
                                            <option key={staff.id} value={staff.id}>
                                                {staff.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing} className="flex-1">{processing ? 'Assigning...' : 'Assign Staff'}</Button>
                                    <Button type="button" variant="secondary" onClick={() => setShowAssignStaff(false)} className="flex-1">Cancel</Button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Order Items */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Quantity</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.product?.image && (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item.product?.name}</p>
                                                    <p className="text-gray-600 text-sm">{item.product?.category?.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-gray-900">
                                            {formatPrice(item.price)}
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-gray-900">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold text-gray-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="mt-6 pt-6 border-t">
                        <div className="flex justify-end">
                            <div className="w-64">
                                <div className="flex justify-between mb-3">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className="font-semibold text-gray-900">{formatPrice(order.total_price)}</p>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <p className="font-bold text-gray-900">Total</p>
                                    <p className="font-bold text-lg text-gray-900">{formatPrice(order.total_price)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Status Form */}
                {showUpdateStatus && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Update Order Status</h3>
                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">New Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing} className="flex-1">{processing ? 'Updating...' : 'Update Status'}</Button>
                                <Button type="button" variant="secondary" onClick={() => setShowUpdateStatus(false)} className="flex-1">Cancel</Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
