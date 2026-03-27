import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition';
  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    // ghost is a transparent / icon-friendly variant (no solid background)
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800',
  };

  const classes = [base, variants[variant] || variants.primary, className].join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
