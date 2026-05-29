import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, Trash2, X, Check } from 'lucide-react';

// ─── CONFIRM DIALOG COMPONENT ─────────────────────────────────────────────────
const ConfirmDialog = ({ title, message, confirmText = 'Delete', cancelText = 'Cancel', variant = 'danger', onConfirm, onCancel }) => {
  const [visible, setVisible] = useState(true);

  const variantCfg = {
    danger:  { icon: <Trash2 size={20} />,       bg: 'bg-rose-500',     ring: 'ring-rose-500/30',   btn: 'bg-rose-600 hover:bg-rose-500' },
    warning: { icon: <AlertTriangle size={20} />, bg: 'bg-amber-500',    ring: 'ring-amber-500/30',  btn: 'bg-amber-600 hover:bg-amber-500' },
    info:    { icon: <Check size={20} />,         bg: 'bg-blue-500',     ring: 'ring-blue-500/30',   btn: 'bg-blue-600 hover:bg-blue-500' },
  };
  const cfg = variantCfg[variant] || variantCfg.danger;

  const handleConfirm = () => { setVisible(false); setTimeout(onConfirm, 150); };
  const handleCancel  = () => { setVisible(false); setTimeout(onCancel,  150); };

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all duration-150 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleCancel}
    >
      <div
        className={`bg-[#0a1929] border border-slate-700/80 rounded-2xl shadow-2xl max-w-sm w-full transition-all duration-150 ${visible ? 'scale-100' : 'scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon header */}
        <div className="p-6 pb-4 flex items-start space-x-4">
          <div className={`w-11 h-11 rounded-xl ${cfg.bg} bg-opacity-20 ring-2 ${cfg.ring} flex items-center justify-center shrink-0 text-white`}
            style={{ background: 'rgba(239,68,68,0.12)' }}
          >
            <span className={variant === 'danger' ? 'text-rose-400' : variant === 'warning' ? 'text-amber-400' : 'text-blue-400'}>
              {cfg.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-100 leading-snug">{title || 'Are you sure?'}</h3>
            {message && <p className="text-sm text-slate-400 mt-1 leading-relaxed">{message}</p>}
          </div>
          <button onClick={handleCancel} className="shrink-0 p-1 rounded-lg hover:bg-slate-800 text-slate-500 transition -mt-0.5">
            <X size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className="px-6 pb-5 flex items-center space-x-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition shadow-lg ${cfg.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── IMPERATIVE API ───────────────────────────────────────────────────────────
// Usage: await confirm({ title: '...', message: '...', confirmText: 'Delete' })
// Returns: true if confirmed, false if cancelled
export const confirm = ({ title, message, confirmText, cancelText, variant } = {}) => {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <ConfirmDialog
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        variant={variant}
        onConfirm={() => { cleanup(); resolve(true);  }}
        onCancel={() =>  { cleanup(); resolve(false); }}
      />
    );
  });
};

export default ConfirmDialog;
