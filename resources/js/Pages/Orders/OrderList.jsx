import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../AdminLayout';
import { PageHeader, Button } from '../../Components/common';

export default function OrderList() {
    const { orders } = usePage().props;
    // allow multi-select filtering (admins can pick multiple statuses)
    const [selectedStatuses, setSelectedStatuses] = useState([]); // empty => show all

    const allStatuses = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    const statusCounts = allStatuses.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, {});

    const filteredOrders = selectedStatuses.length === 0
        ? orders
        : orders.filter(order => selectedStatuses.includes(order.status));

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this order?')) {
            Inertia.delete(`/admin/orders/${id}`);
        }
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP',
        }).format(price || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <PageHeader title="Orders" subtitle="Manage and track customer orders" icon={'orders'} />

                {/* Status Filter: multi-select chips with counts + preset */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Button variant="secondary" onClick={() => setSelectedStatuses([])}>All Orders</Button>

                        {/* individual status chips */}
                        {allStatuses.map((s) => {
                            const active = selectedStatuses.includes(s);
                            return (
                                <button
                                    key={s}
                                    onClick={() => {
                                        setSelectedStatuses(prev => prev.includes(s) ? prev.filter(p => p !== s) : [...prev, s]);
                                    }}
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium transition ${active ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <span className="text-sm">{s}</span>
                                    <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${active ? 'bg-white text-teal-600' : 'bg-gray-100 text-gray-700'}`}>{statusCounts[s] || 0}</span>
                                </button>
                            );
                        })}

                        {/* preset: Pending + Processing */}
                        <Button className="ml-2" onClick={() => setSelectedStatuses(['Pending', 'Processing'])}>Preset: Pending + Processing</Button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-gray-700">Order ID</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-700">Customer</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-700">Total</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-700">Assigned Staff</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-right font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-semibold text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4 text-gray-700">{order.user?.name}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {formatPrice(order.total_price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {order.assigned_staff?.name || <span className="text-gray-400">Not assigned</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <a
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-block bg-teal-600 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition"
                                            >
                                                View
                                            </a>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="inline-block bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-medium transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-600 text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-600 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'Pending').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-600 text-sm">In Progress</p>
                        <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'Processing' || o.status === 'Out for Delivery').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-600 text-sm">Delivered</p>
                        <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'Delivered').length}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}