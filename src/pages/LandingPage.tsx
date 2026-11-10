import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/Landing/HeroSection';
import { MarqueeTicker } from '../components/Landing/MarqueeTicker';
import { ImpactMetrics } from '../components/Landing/ImpactMetrics';
import { CapabilitiesGrid } from '../components/Landing/CapabilitiesGrid';
import { InteractiveShowcase } from '../components/Landing/InteractiveShowcase';
import { ValuePillars } from '../components/Landing/ValuePillars';
import { FaqSection } from '../components/Landing/FaqSection';
import { FooterCta } from '../components/Landing/FooterCta';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLaunchPlanner = () => {
    navigate('/planner');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col selection:bg-[#0016CB] selection:text-white">
      {/* 1. Full-Viewport Hero Section */}
      <HeroSection onLaunchPlanner={handleLaunchPlanner} />

      {/* 2. United Carriers Signature Marquee Corridor Ticker */}
      <MarqueeTicker />

      {/* 3. Impact Metrics Bar ("We map the route. We guarantee compliance.") */}
      <ImpactMetrics />

      {/* 4. Core Capabilities Grid ("Everything your haul needs. Under one roof.") */}
      <CapabilitiesGrid onLaunchPlanner={handleLaunchPlanner} />

      {/* 5. Interactive Showcase Section ("Compliance at Every Milestone") */}
      <InteractiveShowcase onLaunchPlanner={handleLaunchPlanner} />

      {/* 6. Mid-page Marquee Ticker */}
      <MarqueeTicker className="opacity-90 border-t border-white/5" />

      {/* 7. Numbered Value Pillars ("Built for fleets and drivers that can't afford violations") */}
      <ValuePillars />

      {/* 8. Interactive FAQ Accordion */}
      <FaqSection />

      {/* 9. Footer & Bold Bottom Call to Action */}
      <FooterCta onLaunchPlanner={handleLaunchPlanner} />
    </div>
  );
};
