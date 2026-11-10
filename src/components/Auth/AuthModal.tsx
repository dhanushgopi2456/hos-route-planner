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
  Building
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
      setSuccessMessage('Account created successfully! Please sign in with your credentials.');
      setLoginEmail(regEmail.trim());
      if (regPassword) setLoginPassword(regPassword);
      setActiveTab('login');
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md perspective-1200 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 15, y: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: -15, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="uc-card-stark max-w-lg w-full p-6 text-white relative overflow-hidden my-6 shadow-2xl"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-[#161616] border border-[#242424] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-[#6677E3]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight uppercase font-display">
                {activeTab === 'login' ? 'Driver & Dispatcher Sign In' : 'Register New ELD Profile'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                FMCSA Part 395 Driver Portal &amp; Log Sync
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#161616] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#161616] border border-[#242424] p-1 rounded-full my-4 font-mono">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'btn-uc-solid shadow-sm'
                : 'text-slate-400 hover:text-white'
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
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'btn-uc-solid shadow-sm'
                : 'text-slate-400 hover:text-white'
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
              className="p-3 mb-4 rounded-sm bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2 font-mono"
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
              className="p-3 mb-4 rounded-sm bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2 font-mono"
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
            <div className="p-3.5 rounded-sm bg-[#161616] border border-[#242424]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#6677E3]" />
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
                    className="p-2 rounded-sm bg-[#0A0A0A] border border-[#242424] text-left hover:border-[#0016CB] transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="text-xs font-bold text-white truncate font-display">
                      {d.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-[#99A9EE] font-mono capitalize">
                      {d.role}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono truncate">
                      {d.current_cycle_used}h cycle
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 font-mono">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="john.doe@trucking.com"
                    className="w-full p-2.5 pl-9 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 pl-9 pr-9 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
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
                className="w-full py-3 px-4 rounded-full btn-uc-solid text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
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
          <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    required
                    className="w-full p-2 pl-8 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="driver@logistics.com"
                    required
                    className="w-full p-2 pl-8 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value as UserRole)}
                  className="w-full p-2 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none cursor-pointer"
                >
                  <option value="driver">Commercial Driver (CDL-A)</option>
                  <option value="dispatcher">Fleet Dispatcher</option>
                  <option value="fleet_manager">Safety &amp; Compliance Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  CDL / Cert #
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regCdl}
                    onChange={e => setRegCdl(e.target.value)}
                    placeholder="CDL-TX-8493120"
                    className="w-full p-2 pl-8 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                  <FileBadge className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Carrier Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regCarrier}
                    onChange={e => setRegCarrier(e.target.value)}
                    placeholder="National Freight Lines"
                    className="w-full p-2 pl-8 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Home Office City
                </label>
                <input
                  type="text"
                  value={regOffice}
                  onChange={e => setRegOffice(e.target.value)}
                  placeholder="Chicago, IL"
                  className="w-full p-2 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Tractor / Truck #
                </label>
                <input
                  type="text"
                  value={regTruck}
                  onChange={e => setRegTruck(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Trailer #
                </label>
                <input
                  type="text"
                  value={regTrailer}
                  onChange={e => setRegTrailer(e.target.value)}
                  className="w-full p-1.5 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Cycle Used (h)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="69"
                  value={regCycleUsed}
                  onChange={e => setRegCycleUsed(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 text-xs rounded-sm bg-[#161616] border border-[#242424] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none font-mono"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 py-3 px-4 rounded-full btn-uc-solid text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
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
