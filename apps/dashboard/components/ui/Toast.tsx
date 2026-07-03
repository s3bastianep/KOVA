'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; message: string; type: ToastType };

const ToastContext = createContext<(message: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const icon = { success: CheckCircle2, error: XCircle, info: Info };
  const colors = {
    success: { bg: '#E6FAF3', border: '#BBF7D0', text: '#047857' },
    error: { bg: '#FFF0EE', border: '#FECACA', text: '#DC2626' },
    info: { bg: '#EEF2FA', border: '#BFDBFE', text: 'var(--kova-blue)' },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const Icon = icon[t.type];
          const c = colors[t.type];
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-in slide-in-from-right"
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
