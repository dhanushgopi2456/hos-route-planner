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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-2">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Authorized Access Only</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-emerald-400 font-bold">Driver Authentication Required</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Log In to Plan Trips &amp; Access HOS Features
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
                FMCSA Part 395 regulations require verified commercial driver credentials, active cycle hours,
                and carrier details before generating compliant electronic daily logs and route plans.
              </p>
            </div>

            <div className="shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/30 hidden sm:flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/40 rounded-[14px] flex items-center justify-center text-white">
                  <Truck className="w-8 h-8 text-blue-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setActiveTab('demo');
                setErrorMessage(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'demo' ? 'text-blue-600' : 'text-amber-400'}`} />
              <span>1-Click Demo Profiles</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 font-mono">
                Instant
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Register New Driver</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8">
          {/* Alerts */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="font-medium">{errorMessage}</p>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="font-medium">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: 1-CLICK DEMO ACCOUNTS */}
          {activeTab === 'demo' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Select a Pre-Configured Driver Profile
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all cursor-pointer shadow-sm group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        {demo.avatar_url ? (
                          <img
                            src={demo.avatar_url}
                            alt={demo.name}
                            className="w-11 h-11 rounded-xl object-cover border border-blue-400/40 shrink-0 shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                            {demo.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {demo.name}
                          </h4>
                          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider capitalize">
                            {demo.role}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4 font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Carrier:</span>
                          <span className="font-semibold truncate max-w-[130px]" title={demo.carrier_name}>
                            {demo.carrier_name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">CDL #:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{demo.cdl_number}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Cycle Used:</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {Number(demo.current_cycle_used).toFixed(1)}h / 70h
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 group-hover:shadow-blue-500/30 transition-all cursor-pointer"
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
            <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Driver / Dispatcher Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="e.g. john.doe@trucking.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: Use <span className="font-mono text-blue-500">john.doe@trucking.com</span> or select the 1-Click Demo Profiles tab.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <span>Sign In &amp; Unlock Features</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER NEW DRIVER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Driver Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="e.g. alex@freight.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CDL License Number
                  </label>
                  <input
                    type="text"
                    value={regCdl}
                    onChange={e => setRegCdl(e.target.value)}
                    placeholder="CDL-XX-XXXXXXX"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motor Carrier Name
                  </label>
                  <input
                    type="text"
                    value={regCarrier}
                    onChange={e => setRegCarrier(e.target.value)}
                    placeholder="e.g. Express Freight LLC"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Truck (Tractor) Number
                  </label>
                  <input
                    type="text"
                    value={regTruck}
                    onChange={e => setRegTruck(e.target.value)}
                    placeholder="702"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Current Cycle Used (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="69.5"
                    value={regCycleUsed}
                    onChange={e => setRegCycleUsed(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <span>Register Driver &amp; Start Planning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Feature Showcase Grid */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Features Unlocked Upon Driver Sign In:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">Global GPS &amp; Routing</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Automatic waypoint geocoding across North America, Europe, Asia, and worldwide.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">FMCSA § 395 Engine</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Enforces 11h driving, 14h duty window, mandatory 30m breaks, and 70h/8d limits.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">24-Hour ELD Daily Logs</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Pixel-perfect 24.00h visual duty grid graphs, automated midnight splits, and duty remarks.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-left">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 font-bold">
                  <Download className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">Official PDF Export</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Single-click DOT audit-ready log packet generation with driver certification signatures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
