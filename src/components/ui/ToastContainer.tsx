import React from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useHarvestLink();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-fade-in bg-[#17251C] text-white border border-[#166534]/50 rounded-lg shadow-modal p-4 flex items-start gap-3"
        >
          <div className="mt-0.5 shrink-0">
            {toast.variant === 'success' && <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />}
            {toast.variant === 'info' && <Info className="w-4 h-4 text-[#22C55E]" />}
            {toast.variant === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-bold text-white">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-gray-400 hover:text-white transition-colors p-0.5"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
