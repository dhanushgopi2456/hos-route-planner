import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Sparkles,
  ShieldCheck,
  LogOut,
  LogIn,
  Truck
} from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'auth';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  success: (title: string, message: string, action?: ToastItem['action']) => string;
  info: (title: string, message: string, action?: ToastItem['action']) => string;
  warning: (title: string, message: string, action?: ToastItem['action']) => string;
  error: (title: string, message: string, action?: ToastItem['action']) => string;
  authToast: (title: string, message: string, isLogin: boolean) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = 'toast_' + Math.random().toString(36).substring(2, 9);
      const duration = toast.duration ?? 4500;
      const newToast: ToastItem = { ...toast, id, duration };

      setToasts(prev => [...prev.slice(-4), newToast]); // Keep up to 5 visible toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message: string, action?: ToastItem['action']) => {
      return showToast({ title, message, type: 'success', action });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message: string, action?: ToastItem['action']) => {
      return showToast({ title, message, type: 'info', action });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message: string, action?: ToastItem['action']) => {
      return showToast({ title, message, type: 'warning', action });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message: string, action?: ToastItem['action']) => {
      return showToast({ title, message, type: 'error', action, duration: 6000 });
    },
    [showToast]
  );

  const authToast = useCallback(
    (title: string, message: string, isLogin: boolean) => {
      return showToast({
        title,
        message,
        type: 'auth',
        icon: isLogin ? <LogIn className="w-5 h-5 text-emerald-400" /> : <LogOut className="w-5 h-5 text-blue-400" />,
        duration: 5000
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        info,
        warning,
        error,
        authToast,
        removeToast
      }}
    >
      {children}
      {/* Toast Render Floating Overlay */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component with 3D Pop & Progress Bar
const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none sm:right-6"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastCard: React.FC<{
  toast: ToastItem;
  onDismiss: () => void;
}> = ({ toast, onDismiss }) => {
  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-emerald-500/60 dark:border-emerald-500/50',
          bg: 'bg-white/95 dark:bg-slate-900/95',
          glow: 'shadow-emerald-500/20',
          iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
          bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
          title: 'text-slate-900 dark:text-white',
          defaultIcon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        };
      case 'error':
        return {
          border: 'border-rose-500/60 dark:border-rose-500/50',
          bg: 'bg-white/95 dark:bg-slate-900/95',
          glow: 'shadow-rose-500/20',
          iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
          bar: 'bg-gradient-to-r from-rose-500 to-red-400',
          title: 'text-slate-900 dark:text-white',
          defaultIcon: <AlertCircle className="w-5 h-5 text-rose-500" />
        };
      case 'warning':
        return {
          border: 'border-amber-500/60 dark:border-amber-500/50',
          bg: 'bg-white/95 dark:bg-slate-900/95',
          glow: 'shadow-amber-500/20',
          iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
          bar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
          title: 'text-slate-900 dark:text-white',
          defaultIcon: <AlertTriangle className="w-5 h-5 text-amber-500" />
        };
      case 'auth':
        return {
          border: 'border-blue-500/60 dark:border-blue-400/50',
          bg: 'bg-white/95 dark:bg-slate-900/95',
          glow: 'shadow-blue-500/25',
          iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
          bar: 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400',
          title: 'text-slate-900 dark:text-white',
          defaultIcon: <ShieldCheck className="w-5 h-5 text-blue-500" />
        };
      case 'info':
      default:
        return {
          border: 'border-blue-500/50 dark:border-blue-500/40',
          bg: 'bg-white/95 dark:bg-slate-900/95',
          glow: 'shadow-blue-500/20',
          iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
          bar: 'bg-gradient-to-r from-blue-500 to-cyan-400',
          title: 'text-slate-900 dark:text-white',
          defaultIcon: <Info className="w-5 h-5 text-blue-500" />
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -15, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-xl p-4 shadow-2xl ${colors.glow}`}
    >
      {/* Dynamic Animated Accent Shimmer */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200/50 dark:bg-slate-800">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (toast.duration ?? 4500) / 1000, ease: 'linear' }}
          className={`h-full ${colors.bar}`}
        />
      </div>

      <div className="flex items-start gap-3 mt-1">
        {/* Icon Badge */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg}`}>
          {toast.icon || colors.defaultIcon}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <h4 className={`text-xs font-black tracking-tight ${colors.title}`}>{toast.title}</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed break-words">
            {toast.message}
          </p>

          {toast.action && (
            <div className="mt-2.5">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss();
                }}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm cursor-pointer transition-colors"
              >
                {toast.action.label}
              </motion.button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
