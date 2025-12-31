import React, { useEffect, useState } from 'react';

const toastQueue = [];
let toastId = 0;
let setToastsExternal = null;

export function showToast(message, type = 'info', duration = 3000) {
  const id = ++toastId;
  const toast = { id, message, type, duration };
  
  if (setToastsExternal) {
    setToastsExternal(prev => [...prev, toast]);
    setTimeout(() => {
      setToastsExternal(prev => prev.filter(t => t.id !== id));
    }, duration);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setToastsExternal = setToasts;
    return () => { setToastsExternal = null; };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border backdrop-blur-sm fade-in ${getColors(toast.type)}`}
        >
          <span>{getIcon(toast.type)}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
