import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from './AdminLayout';
import PageHeader from '../Components/common/PageHeader';

export default function Dashboard() {
  const { stats, recentOrders, topProducts } = usePage().props;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
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

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className={`bg-white p-6 rounded-lg shadow hover:shadow-lg transition`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtext && <p className="text-gray-500 text-xs mt-2">{subtext}</p>}
        </div>
        <div className={`${color} bg-opacity-10 p-3 rounded-lg text-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
  <PageHeader title="Dashboard" subtitle="Welcome back! Here's your business overview." icon="orders" />

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard 
            title="Total Revenue" 
            value={formatPrice(stats.totalRevenue)} 
            icon="💰"
            color="text-green-600"
            subtext="Delivered orders"
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon="📦"
            color="text-blue-600"
            subtext={`${stats.pendingOrders} pending`}
          />
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts} 
            icon="🛍️"
            color="text-purple-600"
            subtext={`${stats.totalCategories} categories`}
          />
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon="👥"
            color="text-indigo-600"
          />
          <StatCard 
            title="Categories" 
            value={stats.totalCategories} 
            icon="📂"
            color="text-orange-600"
          />
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 font-semibold text-lg">{stats.pendingOrders}</p>
            <p className="text-yellow-700 text-sm mt-1">Pending Orders</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-semibold text-lg">{stats.processingOrders}</p>
            <p className="text-blue-700 text-sm mt-1">Processing</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <p className="text-purple-800 font-semibold text-lg">{stats.outForDeliveryOrders}</p>
            <p className="text-purple-700 text-sm mt-1">Out for Delivery</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-green-800 font-semibold text-lg">{stats.deliveredOrders}</p>
            <p className="text-green-700 text-sm mt-1">Delivered</p>
          </div>
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <a href="/admin/orders" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View All →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Order ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders?.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-semibold text-gray-900">#{order.id}</td>
                        <td className="px-4 py-3 text-gray-700">{order.user?.name}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.total_price)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{formatDate(order.created_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Products</h2>
              <a href="/admin/products" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View All →
              </a>
            </div>
            <div className="space-y-4">
              {topProducts?.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">📦</span>
                        </div>
                      )}
                    </div>
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-gray-600 text-sm">{product.total_sold || 0} sold</p>
                    </div>
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      <span className="inline-block w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No products yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}