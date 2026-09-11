import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false, className = '' }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* 1-Click Smooth Spring Toggle */}
      <motion.button
        whileHover={{ scale: 1.08, rotate: resolvedTheme === 'dark' ? -15 : 15 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleTheme}
        className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-2 ${
          resolvedTheme === 'dark'
            ? 'bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border-slate-700 shadow-md shadow-black/20'
            : 'bg-white/90 hover:bg-slate-100 text-amber-600 border-slate-200 shadow-xs'
        }`}
        title={`Current mode: ${theme} (click to toggle)`}
        aria-label="Toggle light and dark mode"
      >
        <motion.div
          key={resolvedTheme}
          initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-cyan-300 fill-cyan-300/20" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-400/30" />
          )}
        </motion.div>

        {showLabel && (
          <span className="text-xs font-semibold capitalize text-slate-700 dark:text-slate-200">
            {resolvedTheme === 'dark' ? 'Night Cab' : 'Day Log'}
          </span>
        )}
      </motion.button>
    </div>
  );
};
