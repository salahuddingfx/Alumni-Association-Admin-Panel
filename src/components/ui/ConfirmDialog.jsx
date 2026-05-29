import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle, X } from 'lucide-react';

/**
 * ConfirmDialog — beautiful animated dark modal
 * Props:
 *   isOpen        boolean
 *   type          'danger' | 'info' | 'success'  (default 'danger')
 *   title         string
 *   message       string
 *   confirmLabel  string  (default 'Confirm')
 *   cancelLabel   string  (default 'Cancel')
 *   onConfirm     () => void
 *   onCancel      () => void
 */
const icons = {
  danger:  { Icon: Trash2,        ring: 'ring-red-500/30',    bg: 'bg-red-500/10',    icon: 'text-red-400',    btn: 'bg-red-500 hover:bg-red-600 shadow-red-500/30' },
  info:    { Icon: Info,          ring: 'ring-blue-500/30',   bg: 'bg-blue-500/10',   icon: 'text-blue-400',   btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30' },
  success: { Icon: CheckCircle,   ring: 'ring-emerald-500/30',bg: 'bg-emerald-500/10',icon: 'text-emerald-400',btn: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' },
  warning: { Icon: AlertTriangle, ring: 'ring-amber-500/30',  bg: 'bg-amber-500/10',  icon: 'text-amber-400',  btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' },
};

const ConfirmDialog = ({
  isOpen,
  type = 'danger',
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  const config = icons[type] || icons.danger;
  const { Icon } = config;
  const dialogRef = useRef(null);

  // Trap focus & keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel?.();
      if (e.key === 'Enter') onConfirm?.();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onConfirm, onCancel]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onCancel}
      />

      {/* Dialog box */}
      <div
        ref={dialogRef}
        className={`relative bg-dark-card border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Close X */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition"
        >
          <X size={16} />
        </button>

        {/* Icon ring */}
        <div className={`w-16 h-16 rounded-2xl ${config.bg} ring-1 ${config.ring} flex items-center justify-center mb-4`}>
          <Icon size={28} className={config.icon} />
        </div>

        <h3 className="text-lg font-extrabold text-slate-100 mb-1.5">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">{message}</p>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition ${config.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
