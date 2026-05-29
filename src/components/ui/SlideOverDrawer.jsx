import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const SlideOverDrawer = ({ isOpen, onClose, title, children, footer }) => {
  const panelRef = useRef(null);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        // Only trigger close if we clicked on the backdrop overlay
        if (e.target.id === 'drawer-backdrop') {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  return (
    <div
      id="drawer-backdrop"
      className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          ref={panelRef}
          className={`w-screen max-w-md bg-dark-card border-l border-slate-800 shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">{title || 'Details'}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/30 flex items-center justify-end space-x-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideOverDrawer;
