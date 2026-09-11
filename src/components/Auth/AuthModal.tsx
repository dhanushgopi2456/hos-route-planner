import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Truck,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileBadge,
  Building,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login'
}) => {
  const { login, loginAsDemo, register, demoUsers, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('driver');
  const [regCdl, setRegCdl] = useState('CDL-TX-8493120');
  const [regCarrier, setRegCarrier] = useState("National Freight Lines");
  const [regOffice, setRegOffice] = useState('Chicago, IL');
  const [regTruck, setRegTruck] = useState('510');
  const [regTrailer, setRegTrailer] = useState('2209');
  const [regCycleUsed, setRegCycleUsed] = useState(30.0);

  // Status state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your driver or dispatcher email.');
      return;
    }

    const res = await login({ email: loginEmail, password: loginPassword });
    if (res.success) {
      setSuccessMessage(res.message || 'Signed in successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setErrorMessage(res.error || 'Login failed. Please check credentials or select a 1-click demo account.');
    }
  };

  const handleDemoClick = async (demoEmail: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const res = await loginAsDemo(demoEmail);
    if (res.success) {
      setSuccessMessage(res.message || 'Logged in with demo account!');
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setErrorMessage(res.error || 'Demo login failed');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Full name and email are required.');
      return;
    }

    const res = await register({
      name: regName,
      email: regEmail,
      password: regPassword || 'password123',
      role: regRole,
      cdl_number: regCdl,
      carrier_name: regCarrier,
      carrier_office: regOffice,
      truck_number: regTruck,
      trailer_number: regTrailer,
      current_cycle_used: Number(regCycleUsed)
    });

    if (res.success) {
      setSuccessMessage(res.message || 'Account created successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm perspective-1200 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 15, y: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: -15, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="glass-panel-3d dark:bg-slate-900/95 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-900 dark:text-white border border-slate-200/80 relative overflow-hidden my-6"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'login' ? 'Driver & Dispatcher Sign In' : 'Register New ELD Profile'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                FMCSA Part 395 Driver Portal &amp; Log Sync
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Profile
          </button>
        </div>

        {/* Status Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' ? (
          <div className="space-y-4">
            {/* Quick 1-Click Demo Profiles */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-800/60 dark:to-slate-800/40 border border-blue-200/80 dark:border-slate-700">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>1-Click Test Accounts:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {demoUsers.map(d => (
                  <motion.button
                    key={d.id}
                    type="button"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDemoClick(d.email)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-500 transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {d.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono capitalize">
                      {d.role}
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                      {d.current_cycle_used}h cycle
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="john.doe@trucking.com"
                    className="w-full p-2.5 pl-9 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 pl-9 pr-9 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Driver Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        ) : (
          /* TAB 2: REGISTER */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    required
                    className="w-full p-2 pl-8 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="driver@logistics.com"
                    required
                    className="w-full p-2 pl-8 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value as UserRole)}
                  className="w-full p-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="driver">Commercial Driver (CDL-A)</option>
                  <option value="dispatcher">Fleet Dispatcher</option>
                  <option value="fleet_manager">Safety &amp; Compliance Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  CDL / Cert #
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regCdl}
                    onChange={e => setRegCdl(e.target.value)}
                    placeholder="CDL-TX-8493120"
                    className="w-full p-2 pl-8 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <FileBadge className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Carrier Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regCarrier}
                    onChange={e => setRegCarrier(e.target.value)}
                    placeholder="National Freight Lines"
                    className="w-full p-2 pl-8 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Home Office City
                </label>
                <input
                  type="text"
                  value={regOffice}
                  onChange={e => setRegOffice(e.target.value)}
                  placeholder="Chicago, IL"
                  className="w-full p-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Tractor / Truck #
                </label>
                <input
                  type="text"
                  value={regTruck}
                  onChange={e => setRegTruck(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Trailer #
                </label>
                <input
                  type="text"
                  value={regTrailer}
                  onChange={e => setRegTrailer(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Cycle Used (h)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="69"
                  value={regCycleUsed}
                  onChange={e => setRegCycleUsed(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account &amp; Start Trip</span>
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
