import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, Info, X, Menu, ArrowRight, CheckCircle2 } from 'lucide-react';
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

  const handleLogoClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      // Give React Router time to mount landing page
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLaunchPlanner = () => {
    setMobileMenuOpen(false);
    navigate('/planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="bg-[#000000]/95 backdrop-blur-2xl text-white border-b border-[#242424] sticky top-0 z-50 transition-all shadow-xl shadow-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with 3D Tilt Hover */}
          <Link
            to="/"
            onClick={handleLogoClick}
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
            <button
              type="button"
              onClick={() => handleNavClick('hero')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive('/') ? 'text-white bg-white/[0.08]' : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('capabilities-grid')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('crane-sequence')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              HOS Engine
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('milestones')}
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
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLaunchPlanner}
              className="btn-uc-solid px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2 group cursor-pointer shadow-[0_0_20px_rgba(0,22,203,0.5)]"
            >
              <span>Launch Planner</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </motion.button>

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
              <button
                type="button"
                onClick={() => handleNavClick('hero')}
                className={`w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive('/') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={handleLaunchPlanner}
                className={`w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive('/planner') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Trip Planner Workspace
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('capabilities-grid')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Features &amp; Capabilities
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('crane-sequence')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                HOS Dispatch Engine
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('milestones')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                ELD Milestones &amp; Logs
              </button>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive('/about') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                FMCSA Compliance Rules
              </Link>
              <button
                type="button"
                onClick={() => handleNavClick('faq')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                FAQ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Assumptions & HOS Quick Rules Modal */}
      <AnimatePresence>
        {showAssumptionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAssumptionsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0A0A0A] border border-[#242424] rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#242424] pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-lg text-white font-display uppercase tracking-wide">
                    HOS Operational Rules &amp; Assumptions
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAssumptionsModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#161616] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
                <div className="p-3 rounded-lg bg-[#161616] border border-[#242424]">
                  <strong className="text-white block mb-1">11-Hour Driving Limit (§ 395.3(a)(1)):</strong>
                  May drive a maximum of 11 cumulative hours following 10 consecutive hours off duty or sleeper berth.
                </div>
                <div className="p-3 rounded-lg bg-[#161616] border border-[#242424]">
                  <strong className="text-white block mb-1">14-Hour Duty Window (§ 395.3(a)(2)):</strong>
                  May not drive beyond the 14th consecutive hour after coming on duty.
                </div>
                <div className="p-3 rounded-lg bg-[#161616] border border-[#242424]">
                  <strong className="text-white block mb-1">30-Minute Rest Break (§ 395.3(a)(3)(ii)):</strong>
                  Mandatory 30-minute break after 8 cumulative hours of driving without at least a 30-minute interruption.
                </div>
                <div className="p-3 rounded-lg bg-[#161616] border border-[#242424]">
                  <strong className="text-white block mb-1">70-Hour / 8-Day Rolling Cycle (§ 395.3(b)(2)):</strong>
                  May not drive after 70 hours on duty in any 8 consecutive days.
                </div>
                <div className="p-3 rounded-lg bg-[#161616] border border-[#242424]">
                  <strong className="text-white block mb-1">1,000-Mile Fuel Stop Standard:</strong>
                  Automatic 30-minute refueling stop injected before 1,000 cumulative miles.
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAssumptionsModal(false)}
                  className="btn-uc-solid px-6 py-2.5 text-xs font-mono font-bold cursor-pointer"
                >
                  I Understand &bull; Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Driver Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
