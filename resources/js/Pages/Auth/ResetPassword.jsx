import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../AdminLayout';
import NotificationModal from '../../Components/common/NotificationModal';
import { Button } from '../../Components/common';

export default function ResetPassword({ token }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    Inertia.post('/admin/reset-password', { token, email, password, password_confirmation: passwordConfirmation }, {
      onSuccess: () => {
        setNotification({ message: 'Password has been reset. You can now login.', type: 'success' });
        setLoading(false);
      },
      onError: (errors) => {
        setNotification({ message: errors.email || errors.password || 'Failed to reset password', type: 'error' });
        setLoading(false);
      }
    });
  };

  const closeNotification = () => setNotification(null);

  return (
    <AdminLayout title="Reset Password">
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span>Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </label>

            <label className="flex flex-col relative">
              <span>New Password</span>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 00-6 0v2c0 1.657 1.343 3 3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 border rounded px-3 py-2"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {showPassword ? (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.02.156-2.004.447-2.935m2.287-2.287A9.955 9.955 0 0112 3c5.523 0 10 4.477 10 10 0 1.02-.156 2.004-.447 2.935m-2.287 2.287L4.222 4.222" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <label className="flex flex-col relative">
              <span>Confirm Password</span>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 00-6 0v2c0 1.657 1.343 3 3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                  </svg>
                </div>
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 border rounded px-3 py-2"
                />
                <button type="button" onClick={() => setShowPasswordConfirm(v => !v)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {showPasswordConfirm ? (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.02.156-2.004.447-2.935m2.287-2.287A9.955 9.955 0 0112 3c5.523 0 10 4.477 10 10 0 1.02-.156 2.004-.447 2.935m-2.287 2.287L4.222 4.222" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Resetting...' : 'Reset Password'}</Button>
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
