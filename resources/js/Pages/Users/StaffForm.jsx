import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../AdminLayout';
import { FormContainer, PageHeader } from '../../Components/common';
 import { Button } from '../../Components/common';

export default function StaffForm() {
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // basic client-side password checks
    const newErrors = {};
    if (!form.password || form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = 'Password confirmation does not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    Inertia.post('/admin/users/staff', form, {
      onError: (errs) => {
        setErrors(errs);
      }
    });
  };

  return (
    <AdminLayout title="Create Staff">
  <PageHeader title="Create Staff" subtitle="Create a staff member and set their password" icon={'users'} />
  <FormContainer title="Create Staff Account" subtitle="Create a staff member and set their password">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Staff full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="staff@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="block font-semibold mb-2">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 00-6 0v2c0 1.657 1.343 3 3 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-10 p-2 border rounded focus:outline-none focus:border-blue-500"
                placeholder="At least 8 characters"
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
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="block font-semibold mb-2">Confirm Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 00-6 0v2c0 1.657 1.343 3 3 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                </svg>
              </div>
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                name="password_confirmation"
                value={form.password_confirmation || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-10 p-2 border rounded focus:outline-none focus:border-blue-500"
                placeholder="Confirm password"
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
            {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
          </div>

            <div className="flex gap-4">
              <Button type="submit" className="px-6 py-2">Create Staff</Button>
              <Button variant="secondary" type="button" className="px-6 py-2" onClick={() => Inertia.get('/admin/staff')}>Cancel</Button>
            </div>
        </form>
      </FormContainer>
    </AdminLayout>
  );
}
