import React, { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-[#161b22] rounded-xl border border-[#30363d] shadow-2xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] flex flex-col fade-in`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#21262d]">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#21262d] rounded-lg transition-colors text-[#8b949e] hover:text-[#c9d1d9]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
