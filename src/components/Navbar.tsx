import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, Info, X, Menu, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './UI/ThemeToggle';
import { UserProfileMenu } from './Auth/UserProfileMenu';
import { AuthModal } from './Auth/AuthModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAssumptionsModal, setShowAssumptionsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl text-white border-b border-slate-800/80 sticky top-0 z-50 transition-all shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand with 3D tilt hover */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 group perspective-1000"
          >
            <motion.div
              whileHover={{
                rotateY: 15,
                rotateX: -10,
                scale: 1.08,
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-white/20 preserve-3d"
            >
              <Truck className="w-5 h-5 transition-transform group-hover:scale-110 translate-z-10" />
            </motion.div>
            <div>
              <div className="font-black text-base tracking-tight leading-none text-white flex items-center gap-2">
                <span className="bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  HOS ROUTE PLANNER
                </span>
                <motion.span
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/30 to-indigo-500/30 text-blue-300 font-bold border border-blue-400/40 tracking-wider shadow-xs"
                >
                  ELD
                </motion.span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                <span>FMCSA Part 395</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shadow-xs shadow-emerald-400"></span>
                <span className="text-emerald-400 text-[11px] font-sans">Active Compliance</span>
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links with 3D pill animations */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              <span
                className={`relative z-10 ${
                  isActive('/') ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Trip Planner
              </span>
              {isActive('/') && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 border border-blue-400/30 rounded-xl shadow-md shadow-blue-500/30"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>

            <Link
              to="/about"
              className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              <span
                className={`relative z-10 ${
                  isActive('/about') ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                HOS Rules &amp; Assumptions
              </span>
              {isActive('/about') && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 border border-blue-400/30 rounded-xl shadow-md shadow-blue-500/30"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          </nav>

          {/* Right Action & Mobile Menu Toggle */}
          <div className="flex items-center space-x-2.5">
            {/* 70/8 Quick Rules Button */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAssumptionsModal(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 hover:border-blue-500/50 transition-all shadow-md shadow-black/20 hover:shadow-blue-500/10 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>70h / 8d</span>
              <Info className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </motion.button>

            {/* Light / Dark Mode Toggle Button */}
            <ThemeToggle />

            {/* User Profile & Authentication Controls */}
            <UserProfileMenu onOpenAuthModal={() => setShowAuthModal(true)} />

            {/* Mobile Hamburger Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 py-3 space-y-2"
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive('/')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Trip Planner
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive('/about')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                HOS Rules &amp; Assumptions
              </Link>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowAssumptionsModal(true);
                  }}
                  className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>FMCSA 70h/8d Rules</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Assumptions Modal with 3D Perspective Pop */}
      <AnimatePresence>
        {showAssumptionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm perspective-1200">
            <motion.div
              initial={{ opacity: 0, rotateX: 20, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, rotateX: -15, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="glass-panel-3d rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-900 border border-white/80 overflow-hidden relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">FMCSA Regulatory Assumptions</h3>
                    <p className="text-[11px] text-slate-500">49 CFR § 395 Compliance Rules</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAssumptionsModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="py-4 space-y-3 text-sm text-slate-700 leading-relaxed">
                <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl">
                  <span className="font-bold text-blue-950 text-xs">Property-Carrying CMV Driver:</span>
                  <p className="text-blue-800 text-xs mt-0.5 leading-relaxed">
                    Operates in accordance with the April 2022 FMCSA Hours of Service Regulatory Guide.
                  </p>
                </div>

                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="font-bold text-slate-900 min-w-32">• 70 Hours / 8 Days:</span>
                    <span>Rolling cumulative on-duty ceiling before driving is prohibited.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="font-bold text-slate-900 min-w-32">• 11-Hour Drive Limit:</span>
                    <span>Maximum driving hours permitted following 10 consecutive hours off-duty.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="font-bold text-slate-900 min-w-32">• 14-Hour Duty Window:</span>
                    <span>Driving barred after 14 consecutive hours from initial on-duty start.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="font-bold text-slate-900 min-w-32">• 30-Minute Break:</span>
                    <span>Mandatory non-driving rest interval after 8 cumulative driving hours.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="font-bold text-slate-900 min-w-32">• Fueling Stop:</span>
                    <span>Scheduled at least once every 1,000 miles (threshold: 920 mi; 30m duration).</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="font-bold text-slate-900 min-w-32">• Pickup &amp; Dropoff:</span>
                    <span>Exactly 1 hour on-duty not driving scheduled at each terminal.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="font-bold text-slate-900 min-w-32">• Adverse Conditions:</span>
                    <span>Adverse condition exception is strictly disabled per specifications.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowAssumptionsModal(false);
                    navigate('/about');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Full Audit Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowAssumptionsModal(false)}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/30 cursor-pointer"
                >
                  Close &amp; Return
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
