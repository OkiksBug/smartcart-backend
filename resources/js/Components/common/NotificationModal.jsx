// resources/js/Components/common/NotificationModal.jsx
import React, { useEffect } from 'react';

export default function NotificationModal({ message, type = 'success', close, icon = 'ℹ️' }) {
  useEffect(() => {
    const timer = setTimeout(() => close(), 3000);
    return () => clearTimeout(timer);
  }, [close]);

  const bg = type === 'success' ? 'bg-teal-600' : type === 'warning' ? 'bg-yellow-600' : 'bg-red-600';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded shadow text-white ${bg} flex items-center gap-3 z-50`}>
      <div className="text-xl">{icon}</div>
      <div className="text-sm">{message}</div>
    </div>
  );
}