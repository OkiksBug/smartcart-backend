import React from 'react';
import { Button } from './index';

export default function Modal({ show, onClose, title, children, icon = '★' }) {
  if (!show) return null;

  return (
    // use an explicit inline zIndex so this modal always floats above other overlays
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} style={{ pointerEvents: 'auto' }} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 overflow-hidden" style={{ pointerEvents: 'auto' }}>
        <div className="p-4 border-b flex items-center justify-between bg-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded flex items-center justify-center text-white">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          <Button variant="secondary" onClick={onClose} className="px-3 py-1">Close</Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
