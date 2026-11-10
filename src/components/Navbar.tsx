import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, Info, X, Menu, ArrowRight, ExternalLink } from 'lucide-react';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
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
    setTimeout(() => {
      const originInput = document.getElementById('origin-input') || document.querySelector('input[placeholder*="city"], input[placeholder*="Origin"]');
      if (originInput instanceof HTMLInputElement) {
        originInput.focus();
      }
    }, 250);
  };

  return (
    <>
      <header className="bg-[#141415]/95 backdrop-blur-md text-[#ededed] border-b border-[#232325] sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 rounded-md bg-[#2563EB] flex items-center justify-center text-white shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight leading-none text-[#ededed] flex items-center gap-2">
                <span>HOS Route Planner</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#19191b] text-[#a1a1a6] border border-[#232325]">
                  ELD
                </span>
              </div>
              <p className="text-[11px] text-[#85858b] mt-0.5 flex items-center gap-1.5 font-mono">
                <span>FMCSA 49 CFR § 395</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-[#a1a1a6] font-sans">Active dispatch</span>
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'hero', label: 'Home', isAction: true },
              { id: 'capabilities-grid', label: 'Features', isAction: true },
              { id: 'crane-sequence', label: 'HOS rules', isAction: true },
              { id: 'milestones', label: 'ELD logs', isAction: true },
              { id: '/about', label: 'Compliance', isLink: true },
              { id: 'faq', label: 'FAQ', isAction: true }
            ].map(item => {
              const isCurrent = item.isLink ? isActive(item.id) : (isActive('/') && item.id === 'hero');
              return item.isLink ? (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isCurrent ? 'text-white' : 'text-[#a1a1a6] hover:text-white hover:bg-[#19191b]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isCurrent && (
                    <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#2563EB]" />
                  )}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    isCurrent ? 'text-white' : 'text-[#a1a1a6] hover:text-white hover:bg-[#19191b]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isCurrent && (
                    <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#2563EB]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Standalone KV Freight Hero Link */}
            <a
              href="/kv-hero.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-md bg-[#19191b] hover:bg-[#232325] text-[#a1a1a6] hover:text-white border border-[#2e2e32] transition-colors cursor-pointer"
              title="Open pure vanilla JS KV Freight Scroll Hero"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>KV hero</span>
            </a>

            {/* 70/8 Quick Rules Modal Button */}
            <button
              type="button"
              onClick={() => setShowAssumptionsModal(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-[#19191b] hover:bg-[#232325] text-[#a1a1a6] hover:text-white border border-[#2e2e32] transition-colors cursor-pointer"
              title="FMCSA 70-Hour / 8-Day Rule Active"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">70h / 8d</span>
              <Info className="w-3 h-3 text-[#85858b]" />
            </button>

            {/* Launch Planner Primary CTA */}
            <button
              type="button"
              onClick={handleLaunchPlanner}
              className="btn-electric-primary px-3.5 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isActive('/planner') ? 'Workspace' : 'Launch planner'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* Driver Profile & Auth */}
            <UserProfileMenu onOpenAuthModal={() => setShowAuthModal(true)} />

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md bg-[#19191b] border border-[#2e2e32] text-[#a1a1a6] hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-[#232325] bg-[#141415] px-4 py-4 space-y-2 font-sans max-h-[85vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => handleNavClick('hero')}
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive('/') ? 'bg-[#2563EB] text-white' : 'text-[#a1a1a6] hover:bg-[#19191b]'
                }`}
              >
                <span>Home</span>
                <span className="text-[11px] font-mono text-[#85858b]">01</span>
              </button>

              <button
                type="button"
                onClick={handleLaunchPlanner}
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive('/planner') ? 'bg-[#2563EB] text-white' : 'text-[#a1a1a6] hover:bg-[#19191b]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Trip planner workspace</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#19191b] text-blue-400 border border-blue-500/20">Active</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('capabilities-grid')}
                className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-[#a1a1a6] hover:bg-[#19191b] transition-colors cursor-pointer"
              >
                <span>Features &amp; capabilities</span>
                <span className="text-[11px] font-mono text-[#85858b]">02</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('crane-sequence')}
                className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-[#a1a1a6] hover:bg-[#19191b] transition-colors cursor-pointer"
              >
                <span>HOS dispatch engine</span>
                <span className="text-[11px] font-mono text-[#85858b]">03</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('milestones')}
                className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-[#a1a1a6] hover:bg-[#19191b] transition-colors cursor-pointer"
              >
                <span>ELD milestones &amp; logs</span>
                <span className="text-[11px] font-mono text-[#85858b]">04</span>
              </button>

              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive('/about') ? 'bg-[#2563EB] text-white' : 'text-[#a1a1a6] hover:bg-[#19191b]'
                }`}
              >
                <span>FMCSA compliance rules</span>
                <span className="text-[11px] font-mono text-[#85858b]">§ 395</span>
              </Link>

              <button
                type="button"
                onClick={() => handleNavClick('faq')}
                className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-[#a1a1a6] hover:bg-[#19191b] transition-colors cursor-pointer"
              >
                <span>FAQ</span>
                <span className="text-[11px] font-mono text-[#85858b]">05</span>
              </button>

              <div className="pt-2 border-t border-[#232325] flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowAssumptionsModal(true);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[#a1a1a6] bg-[#19191b] border border-[#2e2e32] hover:text-white transition-colors cursor-pointer font-mono"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>70h / 8d compliance rules summary</span>
                </button>

                <a
                  href="/kv-hero.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-blue-400 bg-[#19191b] border border-blue-500/20 hover:text-blue-300 transition-colors font-mono"
                >
                  <span>KV hero (vanilla JS)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
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
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative bg-[#19191b] border border-[#2e2e32] rounded-xl max-w-xl w-full p-5 text-[#ededed] shadow-xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#232325] pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-sm text-[#ededed]">
                    HOS operational rules and assumptions
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAssumptionsModal(false)}
                  className="p-1 rounded-md text-[#85858b] hover:text-white hover:bg-[#232325] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-[#a1a1a6] leading-relaxed">
                <div className="p-3 rounded-lg bg-[#141415] border border-[#232325]">
                  <strong className="text-white block mb-0.5">11-hour driving limit (49 CFR § 395.3(a)(1)):</strong>
                  May drive a maximum of 11 cumulative hours following 10 consecutive hours off duty or sleeper berth.
                </div>
                <div className="p-3 rounded-lg bg-[#141415] border border-[#232325]">
                  <strong className="text-white block mb-0.5">14-hour duty window (49 CFR § 395.3(a)(2)):</strong>
                  May not drive beyond the 14th consecutive hour after coming on duty.
                </div>
                <div className="p-3 rounded-lg bg-[#141415] border border-[#232325]">
                  <strong className="text-white block mb-0.5">30-minute rest break (49 CFR § 395.3(a)(3)(ii)):</strong>
                  Mandatory 30-minute break after 8 cumulative hours of driving without at least a 30-minute interruption.
                </div>
                <div className="p-3 rounded-lg bg-[#141415] border border-[#232325]">
                  <strong className="text-white block mb-0.5">70-hour / 8-day rolling cycle (49 CFR § 395.3(b)(2)):</strong>
                  May not drive after 70 hours on duty in any 8 consecutive days.
                </div>
                <div className="p-3 rounded-lg bg-[#141415] border border-[#232325]">
                  <strong className="text-white block mb-0.5">1,000-mile fuel stop standard:</strong>
                  Automatic 30-minute refueling stop injected before 1,000 cumulative miles.
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAssumptionsModal(false)}
                  className="btn-electric-primary px-4 py-2 text-xs font-medium cursor-pointer"
                >
                  Close
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
