import React from 'react';

export default function FormContainer({ title, children, subtitle }) {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {subtitle && <p className="text-gray-600 mb-4">{subtitle}</p>}
      <div>{children}</div>
    </div>
  );
}
