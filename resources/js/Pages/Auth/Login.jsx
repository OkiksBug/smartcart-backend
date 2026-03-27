import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { Button } from '../../Components/common';
import NotificationModal from '../../Components/common/NotificationModal';

export default function Login() {
  const { errors, status } = usePage().props;
  const [notification, setNotification] = useState(status || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    Inertia.post('/admin/login', { email, password }, {
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold">SC</div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        
        {errors?.email && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.email}
          </div>
        )}
        
        <div className="mb-4 relative">
          <label className="block mb-2 font-semibold text-gray-700">Email</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <input 
              type="email" 
              placeholder="admin@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:border-teal-300"
              required
            />
          </div>
        </div>

        <div className="mb-6 relative">
          <label className="block mb-2 font-semibold text-gray-700">Password</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 00-6 0v2c0 1.657 1.343 3 3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
              </svg>
            </div>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full pl-10 pr-10 p-2 border rounded focus:outline-none focus:border-teal-300"
              required
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
        </div>

        <Button type="submit" disabled={processing} className="w-full">{processing ? 'Logging in...' : 'Login'}</Button>
        {notification && (
          <NotificationModal message={notification} type="success" close={() => setNotification(null)} />
        )}
        {/* Forgot password removed from admin UI; handled in public web app */}

      </form>
      
    </div>
  );
}