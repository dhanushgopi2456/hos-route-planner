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

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (sectionId) {
      if (location.pathname !== '/') {
        navigate(`/#${sectionId}`);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <header className="bg-[#000000]/95 backdrop-blur-2xl text-white border-b border-[#242424] sticky top-0 z-50 transition-all shadow-xl shadow-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with 3D Tilt Hover */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3.5 group perspective-1000"
          >
            <motion.div
              whileHover={{
                rotateY: 15,
                rotateX: -10,
                scale: 1.08,
                boxShadow: '0 10px 25px -5px rgba(0, 82, 255, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 border border-white/20 preserve-3d"
            >
              <Truck className="w-5 h-5 transition-transform group-hover:scale-110 translate-z-10" />
            </motion.div>
            <div>
              <div className="font-black text-base sm:text-lg tracking-tight leading-none text-white flex items-center gap-2 font-display">
                <span className="bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  HOS ROUTE PLANNER
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30 tracking-wider font-mono">
                  ELD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                <span>FMCSA 49 CFR § 395</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shadow-xs shadow-emerald-400" />
                <span className="text-emerald-400 font-sans font-semibold">Active Dispatch</span>
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links (United Carriers style) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive('/') ? 'text-white bg-white/[0.08]' : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => handleNavClick('features')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('eld-showcase')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              HOS Engine
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('features')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              ELD Logs
            </button>

            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive('/about') ? 'text-white bg-white/[0.08]' : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Compliance
            </Link>

            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* 70/8 Quick Rules Modal Button */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAssumptionsModal(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#161616] hover:bg-[#242424] text-slate-200 border border-[#2E2E2E] hover:border-[#0016CB] transition-all cursor-pointer font-mono"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>70h / 8d</span>
              <Info className="w-3 h-3 text-slate-400 ml-0.5" />
            </motion.button>

            {/* Launch Planner Primary Pill CTA */}
            <Link
              to="/planner"
              className="btn-uc-solid px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2 group cursor-pointer shadow-[0_0_20px_rgba(0,22,203,0.5)]"
            >
              <span>Launch Planner</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* Driver Profile & Auth */}
            <UserProfileMenu onOpenAuthModal={() => setShowAuthModal(true)} />

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
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
              className="lg:hidden border-t border-slate-800 bg-[#06080E]/95 backdrop-blur-2xl px-4 py-4 space-y-2 font-sans"
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive('/') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Home
              </Link>
              <Link
                to="/planner"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive('/planner') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Trip Planner Workspace
              </Link>
              <button
                type="button"
                onClick={() => handleNavClick('features')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('eld-showcase')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                HOS Engine &amp; Milestones
              </button>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive('/about') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Compliance Rules &amp; Audits
              </Link>
              <button
                type="button"
                onClick={() => handleNavClick('faq')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                FAQ
              </button>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
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

      {/* Assumptions Modal */}
      <AnimatePresence>
        {showAssumptionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md perspective-1200">
            <motion.div
              initial={{ opacity: 0, rotateX: 20, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, rotateX: -15, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-100 overflow-hidden relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white font-display">FMCSA Regulatory Assumptions</h3>
                    <p className="text-[11px] text-slate-400 font-mono">49 CFR § 395 Compliance Rules</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAssumptionsModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="py-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-2xl">
                  <span className="font-bold text-blue-300 text-xs">Property-Carrying CMV Standard:</span>
                  <p className="text-slate-300 text-xs mt-0.5 leading-relaxed font-sans">
                    Operates in accordance with the April 2022 FMCSA Hours of Service Regulatory Guide.
                  </p>
                </div>

                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white min-w-32 font-mono">&bull; 70 Hours / 8 Days:</span>
                    <span>Rolling cumulative on-duty ceiling before driving is prohibited.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white min-w-32 font-mono">&bull; 11-Hour Drive Limit:</span>
                    <span>Maximum driving hours permitted following 10 consecutive hours off-duty.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white min-w-32 font-mono">&bull; 14-Hour Duty Window:</span>
                    <span>Driving barred after 14 consecutive hours from initial on-duty start.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white min-w-32 font-mono">&bull; 30-Minute Break:</span>
                    <span>Mandatory non-driving rest interval after 8 cumulative driving hours.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white min-w-32 font-mono">&bull; Fueling Stop:</span>
                    <span>Scheduled at least once every 1,000 miles (threshold: 920 mi; 30m duration).</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white min-w-32 font-mono">&bull; Pickup &amp; Dropoff:</span>
                    <span>Exactly 1 hour on-duty not driving scheduled at each terminal.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssumptionsModal(false);
                    navigate('/about');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Full Audit Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowAssumptionsModal(false)}
                  className="btn-electric-primary px-5 py-2 text-xs font-bold cursor-pointer"
                >
                  Close &amp; Return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
