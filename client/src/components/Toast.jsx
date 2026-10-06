import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';

        return (
          <div key={toast.id} className="toast-item">
            {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
            {isError && <AlertCircle size={18} color="#ef4444" />}
            {!isSuccess && !isError && <Info size={18} color="#818cf8" />}

            <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>
              {toast.message}
            </span>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{ background: 'transparent', color: '#64748b', marginLeft: '8px' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
