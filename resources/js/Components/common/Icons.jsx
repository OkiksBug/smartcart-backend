import React from 'react';

export const Icon = ({ name, className = '' }) => {
  switch (name) {
    case 'products':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9 5 9-5-9-5-9 5z" />
        </svg>
      );
    case 'orders':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21a1 1 0 100-2 1 1 0 000 2zM8 21a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20H4v-2a4 4 0 014-4h1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      );
    default:
      return <span className={className}>★</span>;
  }
};
