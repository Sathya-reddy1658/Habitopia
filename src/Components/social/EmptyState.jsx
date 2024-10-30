import React from 'react';

export default function EmptyState({ icon: Icon, message }) {
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-sm">
      <Icon className="w-12 h-12 mx-auto text-indigo-400 mb-2" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}