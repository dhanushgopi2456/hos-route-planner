import React, { useState } from 'react';
import {
  Lock,
  User as UserIcon,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Key,
  CheckCircle2,
  FileText,
  MapPin,
  Clock,
  Download,
  Building,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface AuthGateCardProps {
  onSuccess?: () => void;
}

export const AuthGateCard: React.FC<AuthGateCardProps> = ({ onSuccess }) => {
  const { login, loginAsDemo, register, demoUsers, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('password123');
  const [regRole, setRegRole] = useState<UserRole>('driver');
  const [regCdl, setRegCdl] = useState('CDL-US-9284102');
  const [regCarrier, setRegCarrier] = useState("National Commercial Express");
  const [regOffice, setRegOffice] = useState('Chicago, IL');
  const [regTruck, setRegTruck] = useState('702');
  const [regTrailer, setRegTrailer] = useState('4410');
  const [regCycleUsed, setRegCycleUsed] = useState(32.5);

  // Status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoSelect = async (demoEmail: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const res = await loginAsDemo(demoEmail);
      if (res.success) {
        setSuccessMessage(res.message || 'Logged in successfully!');
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.error || 'Failed to sign in with demo driver profile.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please provide your driver or dispatcher email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({ email: loginEmail, password: loginPassword });
      if (res.success) {
        setSuccessMessage(res.message || 'Authenticated successfully!');
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.error || 'Invalid credentials. You may also use any 1-click demo profile below.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Full driver name and email are required to register.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        cdl_number: regCdl,
        carrier_name: regCarrier,
        carrier_office: regOffice,
        truck_number: regTruck,
        trailer_number: regTrailer,
        current_cycle_used: Number(regCycleUsed) || 0
      });
      if (res.success) {
        setSuccessMessage(res.message || 'Driver profile registered!');
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.error || 'Registration failed. An account with this email may already exist.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Container */}
      <div className="uc-card-stark overflow-hidden shadow-2xl transition-all">
        {/* Top Banner */}
        <div className="bg-[#0A0A0A] border-b border-[#242424] p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0016CB]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] text-[#99A9EE] border border-[#242424] text-xs font-mono font-bold tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5 text-[#6677E3]" />
                <span>Authorized Driver Access</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-emerald-400 font-sans">FMCSA Verified</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display uppercase">
                Sign In to Plan Trips &amp; Access HOS Logs
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed font-sans">
                FMCSA Part 395 regulations require verified commercial driver credentials, active cycle hours,
                and carrier details before generating compliant electronic daily logs and route plans.
              </p>
            </div>

            <div className="shrink-0">
              <div className="w-16 h-16 rounded-sm bg-[#161616] border border-[#242424] p-0.5 shadow-lg hidden sm:flex items-center justify-center">
                <Truck className="w-8 h-8 text-[#6677E3]" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#242424] overflow-x-auto font-mono">
            <button
              type="button"
              onClick={() => {
                setActiveTab('demo');
                setErrorMessage(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'demo'
                  ? 'btn-uc-solid shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>1-Click Demo Profiles</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono">
                Instant
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'btn-uc-solid shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In with Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'btn-uc-solid shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Register New Driver</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 bg-[#000000]">
          {/* Alerts */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex items-start gap-3 font-mono"
              >
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="font-medium">{errorMessage}</p>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs sm:text-sm flex items-start gap-3 font-mono"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="font-medium">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: 1-CLICK DEMO ACCOUNTS */}
          {activeTab === 'demo' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    Select a Pre-Configured Driver Profile
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    Click any driver below to sign in instantly with simulated CDL credentials and cycle hours.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {demoUsers.map(demo => (
                  <motion.div
                    key={demo.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isSubmitting && handleDemoSelect(demo.email)}
                    className="p-5 rounded-sm border border-[#242424] bg-[#161616] hover:border-[#0016CB] transition-all cursor-pointer shadow-sm group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        {demo.avatar_url ? (
                          <img
                            src={demo.avatar_url}
                            alt={demo.name}
                            className="w-11 h-11 rounded-sm object-cover border border-[#0016CB]/40 shrink-0 shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-sm bg-[#0016CB] text-white flex items-center justify-center font-bold text-sm">
                            {demo.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-white group-hover:text-[#6677E3] transition-colors font-display">
                            {demo.name}
                          </h4>
                          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider capitalize">
                            {demo.role}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 mb-4 font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Carrier:</span>
                          <span className="font-semibold text-white truncate max-w-[130px]" title={demo.carrier_name}>
                            {demo.carrier_name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">CDL #:</span>
                          <span className="font-semibold text-slate-300">{demo.cdl_number}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Cycle Used:</span>
                          <span className="font-bold text-cyan-300">
                            {Number(demo.current_cycle_used).toFixed(1)}h / 70h
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-3 rounded-full btn-uc-solid text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Sign In as {demo.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL EMAIL SIGN IN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-4 font-mono">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Driver / Dispatcher Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="e.g. john.doe@trucking.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#242424] bg-[#161616] text-white text-sm focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: Use <span className="font-mono text-blue-400">john.doe@trucking.com</span> or select the 1-Click Demo Profiles tab.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#242424] bg-[#161616] text-white text-sm focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full btn-uc-solid text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Authorize &amp; Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER NEW DRIVER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Driver Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Dhanush Gopi"
                    className="w-full p-2.5 rounded-sm border border-[#242424] bg-[#161616] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="e.g. dhanush@commercialfleet.com"
                    className="w-full p-2.5 rounded-sm border border-[#242424] bg-[#161616] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">CDL Number</label>
                  <input
                    type="text"
                    value={regCdl}
                    onChange={e => setRegCdl(e.target.value)}
                    className="w-full p-2.5 rounded-sm border border-[#242424] bg-[#161616] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Carrier Name</label>
                  <input
                    type="text"
                    value={regCarrier}
                    onChange={e => setRegCarrier(e.target.value)}
                    className="w-full p-2.5 rounded-sm border border-[#242424] bg-[#161616] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Truck #</label>
                  <input
                    type="text"
                    value={regTruck}
                    onChange={e => setRegTruck(e.target.value)}
                    className="w-full p-2.5 rounded-sm border border-[#242424] bg-[#161616] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Current Cycle Used (hrs / 70h)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="69"
                    value={regCycleUsed}
                    onChange={e => setRegCycleUsed(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-sm border border-[#242424] bg-[#161616] text-white focus:border-[#0016CB] focus:ring-1 focus:ring-[#0016CB] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full btn-uc-solid text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Register &amp; Launch Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
