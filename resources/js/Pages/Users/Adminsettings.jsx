import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../AdminLayout';
import ProfileSettingsForm from '../../Components/Admin/ProfileSettingsForm';
import axios from 'axios';

export default function Adminsettings() {
  const { user } = usePage().props;
  const [previewUrl, setPreviewUrl] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    avatar: null,
    _method: 'put',
  });

  // modal state for showing success / error alerts
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIsSuccess, setAlertIsSuccess] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setData('avatar', file || null);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const onRemoveAvatar = async () => {
    try {
      await axios.delete('/admin/profile/avatar');
      setPreviewUrl(null);
      Inertia.visit('/admin/profile/view');
    } catch (e) {
      console.error('Failed to remove avatar', e);
      setAlertTitle('Failed to remove avatar');
      setAlertMessage('There was a problem removing your avatar. Please try again.');
      setAlertIsSuccess(false);
      setAlertOpen(true);
    }
  };

  const submit = (e) => {
    e.preventDefault();

    post('/admin/profile', {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        reset('password', 'password_confirmation');
        setPreviewUrl(null);
        // show success modal; navigate to profile view when user confirms
        setAlertTitle('Profile updated');
        setAlertMessage('Your profile has been successfully updated.');
        setAlertIsSuccess(true);
        setAlertOpen(true);
      },
      onError: (err) => {
        console.error('Profile update failed:', err);
        // extract server validation message(s) when available
        let message = 'Failed to update profile. Please check the form for errors.';

        // Inertia validation errors come as an object mapping field => [messages]
        if (err && typeof err === 'object' && !err.response) {
          const firstKey = Object.keys(err)[0];
          if (firstKey && err[firstKey] && Array.isArray(err[firstKey]) && err[firstKey][0]) {
            message = err[firstKey][0];
          }
        }

        // axios-style error with response.data
        if (err && err.response && err.response.data) {
          const d = err.response.data;
          if (d.message) message = d.message;
          else if (d.errors) {
            const firstKey = Object.keys(d.errors)[0];
            if (firstKey && d.errors[firstKey] && d.errors[firstKey][0]) {
              message = d.errors[firstKey][0];
            }
          }
        }

        setAlertTitle('Failed to save changes');
        setAlertMessage(message);
        setAlertIsSuccess(false);
        setAlertOpen(true);
      },
    });
  };

  return (
    <AdminLayout title="Profile & Settings">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow relative z-50 pointer-events-auto">
        <h1 className="text-2xl font-bold mb-4">Profile & Settings</h1>

        <ProfileSettingsForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          user={user}
          onFileChange={onFileChange}
          onSubmit={submit}
          previewUrl={previewUrl}
          onRemoveAvatar={onRemoveAvatar}
        />
        {/* Alert Modal */}
        {alertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setAlertOpen(false)} />
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-10">
              <h3 className="text-lg font-bold mb-2">{alertTitle}</h3>
              <p className="text-sm text-gray-700 mb-4">{alertMessage}</p>
              <div className="flex justify-end gap-3">
                {!alertIsSuccess && (
                  <button
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                    onClick={() => setAlertOpen(false)}
                  >
                    Close
                  </button>
                )}
                <button
                  className={`px-4 py-2 rounded text-white ${alertIsSuccess ? 'bg-teal-600 hover:bg-teal-700' : 'bg-red-600 hover:bg-red-700'}`}
                  onClick={() => {
                    setAlertOpen(false);
                    if (alertIsSuccess) {
                      // navigate to profile view on success
                      Inertia.visit('/admin/profile/view');
                    }
                    // on failure, stay on settings page (modal closed)
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}