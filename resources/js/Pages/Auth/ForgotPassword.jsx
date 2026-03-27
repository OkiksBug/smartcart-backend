// resources/js/Pages/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../AdminLayout';
import NotificationModal from '../../Components/common/NotificationModal';
import { Button } from '../../Components/common';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    Inertia.post('/admin/forgot-password', { email }, {
      onSuccess: () => {
        setNotification({ message: 'Password reset link sent to your email', type: 'success' });
        setLoading(false);
      },
      onError: (errors) => {
        setNotification({ message: errors.email || 'Something went wrong', type: 'error' });
        setLoading(false);
      }
    });
  };

  const closeNotification = () => setNotification(null);

  return (
    <AdminLayout title="Forgot Password">
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span>Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </div>
      </div>

      {notification && (
        <NotificationModal 
          message={notification.message} 
          type={notification.type} 
          close={closeNotification} 
        />
      )}
    </AdminLayout>
  );
}