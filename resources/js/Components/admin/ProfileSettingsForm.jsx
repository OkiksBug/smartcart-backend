import React from 'react';

export default function ProfileSettingsForm({
  data,
  setData,
  errors,
  processing,
  user,
  onFileChange,
  onSubmit,
  previewUrl,
  onRemoveAvatar,
}) {
  return (
    <form
      onSubmit={onSubmit}
      encType="multipart/form-data"
      className="relative z-50 pointer-events-auto"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Name</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => setData('name', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => setData('email', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          New Password (leave blank to keep current)
        </label>
        <input
          type="password"
          value={data.password || ''}
          onChange={(e) => setData('password', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
        <input
          type="password"
          value={data.password_confirmation || ''}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Avatar</label>
        <input type="file" accept="image/*" onChange={onFileChange} />

        {(previewUrl || user?.avatar) && (
          <div className="mt-2 flex items-center gap-3">
            <img
              src={previewUrl ? previewUrl : `/storage/${user.avatar}`}
              alt="avatar"
              className="w-20 h-20 object-cover rounded"
            />

            <div>
              {user?.avatar && !previewUrl && (
                <button
                  type="button"
                  onClick={onRemoveAvatar}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove avatar
                </button>
              )}

              {previewUrl && (
                <div className="text-sm text-gray-600">
                  Preview (will be saved on submit)
                </div>
              )}
            </div>
          </div>
        )}

        {errors.avatar && <div className="text-red-500 text-sm mt-1">{errors.avatar}</div>}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={processing}
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {processing ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}