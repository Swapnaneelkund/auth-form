import React from 'react';
import { Loader } from 'lucide-react';

const RedirectingNotification = ({ message, visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-sm text-white rounded-lg p-6 shadow-lg flex items-center gap-4">
        <Loader className="animate-spin w-6 h-6" />
        <span className="text-lg font-medium">{message}</span>
      </div>
    </div>
  );
};

export default RedirectingNotification;
