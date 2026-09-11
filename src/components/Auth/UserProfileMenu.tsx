import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  LogOut,
  Shield,
  Truck,
  Building,
  ChevronDown,
  Clock,
  Sparkles,
  Sun,
  Moon,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface UserProfileMenuProps {
  onOpenAuthModal: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ onOpenAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <motion.button
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenAuthModal}
        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer border border-white/20"
      >
        <UserIcon className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </motion.button>
    );
  }

  const userCycleUsed = Number(user.current_cycle_used ?? 0);
  const hoursRemaining = Math.max(0, 70 - userCycleUsed);

  return (
    <div ref={menuRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white text-xs cursor-pointer shadow-md shadow-black/20"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-7 h-7 rounded-xl object-cover border border-blue-400/50"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs border border-white/20">
            {user.name.charAt(0)}
          </div>
        )}

        <div className="text-left hidden sm:block">
          <div className="font-bold text-white leading-none truncate max-w-28">
            {user.name}
          </div>
          <div className="text-[10px] text-blue-300 font-mono flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="capitalize">{user.role}</span>
          </div>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute right-0 mt-2 w-72 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-slate-100 shadow-2xl p-4 z-50 overflow-hidden"
          >
            {/* User Profile Card Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-500/50 shadow-md shadow-blue-500/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden">
                <div className="font-black text-sm text-white truncate">{user.name}</div>
                <div className="text-xs text-slate-400 truncate">{user.email}</div>
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  <Shield className="w-3 h-3" />
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Carrier & Tractor Details */}
            <div className="py-3 space-y-2 text-xs border-b border-slate-800 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>Carrier:</span>
                </span>
                <span className="font-semibold text-white truncate max-w-36 text-right">
                  {user.carrier_name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Truck / Trailer:</span>
                </span>
                <span className="font-mono text-white">
                  #{user.truck_number} / #{user.trailer_number}
                </span>
              </div>

              {user.cdl_number && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CDL Number:</span>
                  <span className="font-mono text-blue-300">{user.cdl_number}</span>
                </div>
              )}

              {/* 70/8 Status Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] mb-1 font-mono">
                  <span className="text-slate-400">70h/8d Cycle Used:</span>
                  <span className="text-emerald-400 font-bold">
                    {userCycleUsed.toFixed(1)}h / 70.0h
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                    style={{ width: `${Math.min(100, (userCycleUsed / 70) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
                  {hoursRemaining.toFixed(1)} hours remaining
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 space-y-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {resolvedTheme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-cyan-300" />
                  )}
                  <span>Toggle Theme Mode</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {resolvedTheme === 'dark' ? 'Night Cab' : 'Day Log'}
                </span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  setIsOpen(false);
                  await logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
