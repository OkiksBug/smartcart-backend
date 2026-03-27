import React from 'react';
import { Icon } from './Icons';

export default function PageHeader({ title, subtitle, icon, action }) {
  const renderIcon = () => {
    if (!icon) return <span>★</span>;
    // if icon prop is already a React node, render it
    if (typeof icon !== 'string') return icon;
    // otherwise treat as icon name
    return <Icon name={icon} className="w-6 h-6 text-white" />;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-md flex items-center justify-center text-white text-xl">{renderIcon()}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="flex-1" />

        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
