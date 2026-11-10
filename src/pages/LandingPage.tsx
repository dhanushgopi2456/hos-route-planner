import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeroSection } from '../components/Landing/HeroSection';
import { MarqueeTicker } from '../components/Landing/MarqueeTicker';
import { ImpactMetrics } from '../components/Landing/ImpactMetrics';
import { CraneTruckInteractiveShowcase } from '../components/Landing/CraneTruckInteractiveShowcase';
import { KvScrollHero } from '../components/Landing/KvScrollHero';
import { CapabilitiesGrid } from '../components/Landing/CapabilitiesGrid';
import { MilestoneHighwayRoad } from '../components/Landing/MilestoneHighwayRoad';
import { ValuePillars } from '../components/Landing/ValuePillars';
import { FaqSection } from '../components/Landing/FaqSection';
import { FooterCta } from '../components/Landing/FooterCta';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  const handleLaunchPlanner = (demo?: boolean, tab?: string) => {
    const params = new URLSearchParams();
    if (demo) params.set('demo', '1');
    if (tab) params.set('tab', tab);
    const qs = params.toString();
    navigate(qs ? `/planner?${qs}` : '/planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col selection:bg-[#0016CB] selection:text-white">
      {/* 1. Celestial Hero Section with Planet Sphere & Blue Radiant Horizon */}
      <HeroSection onLaunchPlanner={(demo) => handleLaunchPlanner(demo)} />

      {/* 2. United Carriers Signature Marquee Corridor Ticker */}
      <MarqueeTicker />

      {/* 3. Section 2: High-Contrast Impact Metrics ("WE PLAN ROUTES. WE SHIELD COMPLIANCE.") */}
      <ImpactMetrics />

      {/* 4. Section 3: KV Freight Scroll Hero (Reach Stacker & Semi-Truck Sequence) */}
      <div id="crane-sequence">
        <KvScrollHero onLaunchPlanner={(demo, tab) => handleLaunchPlanner(demo, tab)} />
      </div>

      {/* 4b. Interactive Telemetry Stage Inspector */}
      <CraneTruckInteractiveShowcase onLaunchPlanner={() => handleLaunchPlanner(false)} />

      {/* 5. Section 4: Capabilities Grid with Horizontal Road, Gliding Semi-Truck & Official Icons */}
      <CapabilitiesGrid onLaunchPlanner={(tab) => handleLaunchPlanner(true, tab)} />

      {/* 6. Section 5: Vertical Winding Highway Road ("RELIABILITY AT EVERY MILESTONE") */}
      <MilestoneHighwayRoad onLaunchPlanner={(demo) => handleLaunchPlanner(demo)} />

      {/* 7. Section 6: Numbered Value Pillars */}
      <ValuePillars />

      {/* 8. Section 7: Regulatory FAQ Accordion */}
      <FaqSection />

      {/* 9. Section 8: Footer Container Terminal Backdrop & Bold CTA */}
      <FooterCta onLaunchPlanner={(demo) => handleLaunchPlanner(demo)} />
    </div>
  );
};
