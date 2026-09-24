import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

type ToastTone = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  pushToast: (message: string, tone?: ToastTone) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = ++toastId;
      setItems((prev) => [...prev, { id, message, tone }]);
      window.setTimeout(() => remove(id), 4200);
    },
    [remove],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      pushToast,
      success: (message) => pushToast(message, 'success'),
      error: (message) => pushToast(message, 'error'),
      info: (message) => pushToast(message, 'info'),
    }),
    [pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="toast-stack" aria-live="polite">
          {items.map((item) => (
            <div key={item.id} className={`toast toast-${item.tone}`} role="status">
              <span>{item.message}</span>
              <button
                type="button"
                className="toast-close"
                onClick={() => remove(item.id)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
