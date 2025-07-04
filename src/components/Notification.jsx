import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000); // Message disappears after 5 seconds
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, onClose]);

  if (!isVisible || !message) return null;

  const bgColor = type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20';
  const borderColor = type === 'success' ? 'border-green-500/30' : 'border-red-500/30';
  const textColor = type === 'success' ? 'text-green-100' : 'text-red-100';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 ${bgColor} ${borderColor} ${textColor} transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={() => {
        setIsVisible(false);
        onClose();
      }} className="ml-auto text-white/70 hover:text-white">
        &times;
      </button>
    </div>
  );
};

export default Notification;
