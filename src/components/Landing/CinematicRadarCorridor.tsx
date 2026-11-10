import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Navigation, Clock, Fuel, ShieldCheck, MapPin, Radio, Activity } from 'lucide-react';

interface CinematicRadarCorridorProps {
  className?: string;
}

export const CinematicRadarCorridor: React.FC<CinematicRadarCorridorProps> = ({ className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(10);
  const [rotateY, setRotateY] = useState<number>(-12);
  const [activeNode, setActiveNode] = useState<number>(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -16;
    const rotY = ((x - centerX) / centerX) * 16;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(8);
    setRotateY(-10);
  };

  const waypoints = [
    { id: 1, name: 'Chicago, IL', type: 'ORIGIN', mile: 0, code: 'ORD-01', time: '06:00' },
    { id: 2, name: 'Indianapolis, IN', type: 'PICKUP', mile: 184, code: 'IND-44', time: '09:15' },
    { id: 3, name: 'Effingham, IL', type: 'REST_BREAK', mile: 412, code: 'EFH-30', time: '13:30' },
    { id: 4, name: 'Little Rock, AR', type: 'FUEL', mile: 820, code: 'LIT-08', time: '20:15' },
    { id: 5, name: 'Dallas, TX', type: 'DROPOFF', mile: 1150, code: 'DFW-90', time: '14:30' },
  ];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1200 cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 220, damping: 25, mass: 0.6 }}
        className="preserve-3d relative rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Subtle Ambient Radial Highlight from behind */}
        <div className="pointer-events-none absolute -inset-24 bg-gradient-to-tr from-[#0016CB]/20 via-transparent to-transparent blur-3xl opacity-75" />

        {/* Top 3D Header Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#242424] pb-4 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#161616] border border-[#2E2E2E] text-[#0016CB]">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
            </span>
            <div>
              <span className="text-[12px] font-bold text-white tracking-widest uppercase">
                3D HIGHWAY CORRIDOR RADAR
              </span>
              <span className="block text-[10px] text-slate-500 uppercase">
                SPATIAL PROJECTION &bull; OSRM TELEMETRY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0016CB]/15 border border-[#0016CB]/40 text-[#99A9EE] text-[10px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0016CB] animate-ping" />
              LIVE 49 CFR § 395
            </span>
          </div>
        </div>

        {/* 3D Isometric Viewport Canvas */}
        <div className="relative my-4 h-64 sm:h-72 w-full rounded-xl bg-[#000000] border border-[#242424] overflow-hidden flex items-center justify-center preserve-3d">
          
          {/* Animated 3D Perspective Highway Grid Mesh */}
          <div
            className="absolute inset-0 bg-grid-mesh opacity-30"
            style={{
              transform: 'rotateX(55deg) translateZ(-40px) scale(1.6)',
              transformOrigin: '50% 100%'
            }}
          />

          {/* Sweeping Laser Scan Line */}
          <div
            className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#0016CB]/20 to-transparent"
            style={{ animation: 'scanline3D 4s linear infinite' }}
          />

          {/* Dynamic 3D Highway SVG Corridor */}
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 500 240"
          >
            <defs>
              <linearGradient id="corridorGlow3D" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0016CB" stopOpacity="0.95" />
                <stop offset="30%" stopColor="#3346D7" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#0016CB" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
              </linearGradient>
              <filter id="laserBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Projected Road Ribbons */}
            <path
              d="M 40,190 C 130,170 170,120 250,130 C 330,140 380,80 460,60"
              fill="none"
              stroke="rgba(0, 22, 203, 0.25)"
              strokeWidth="18"
            />
            <path
              d="M 40,190 C 130,170 170,120 250,130 C 330,140 380,80 460,60"
              fill="none"
              stroke="url(#corridorGlow3D)"
              strokeWidth="4"
              filter="url(#laserBlur)"
            />
            <path
              d="M 40,190 C 130,170 170,120 250,130 C 330,140 380,80 460,60"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              className="animate-road-dash"
            />

            {/* Waypoint 1: Origin */}
            <circle cx="40" cy="190" r="14" fill="none" stroke="#0016CB" strokeWidth="1" opacity="0.6" />
            <circle cx="40" cy="190" r="6" fill="#0016CB" stroke="#FFFFFF" strokeWidth="2" />

            {/* Waypoint 2: Pickup */}
            <circle cx="160" cy="140" r="5" fill="#3346D7" stroke="#FFFFFF" strokeWidth="2" />

            {/* Waypoint 3: Break */}
            <circle cx="250" cy="130" r="5" fill="#6677E3" stroke="#FFFFFF" strokeWidth="2" />

            {/* Waypoint 4: Fuel Stop */}
            <circle cx="350" cy="115" r="12" fill="none" stroke="#0016CB" strokeWidth="1" opacity="0.6" />
            <circle cx="350" cy="115" r="5.5" fill="#0016CB" stroke="#FFFFFF" strokeWidth="2" />

            {/* Waypoint 5: Dropoff */}
            <circle cx="460" cy="60" r="16" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />
            <circle cx="460" cy="60" r="6" fill="#FFFFFF" stroke="#0016CB" strokeWidth="2.5" />
          </svg>

          {/* Floating 3D Node Pins & Tactical Badges */}
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between font-mono text-[11px]">
            <div className="flex justify-between items-start">
              <div
                className="bg-[#0A0A0A]/95 border border-[#374151] px-3 py-1.5 rounded-md shadow-lg text-white"
                style={{ transform: 'translateZ(25px)' }}
              >
                <span className="text-[10px] text-slate-500 uppercase block">ORIGIN &bull; 06:00 AM</span>
                <span className="font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0016CB]" />
                  CHICAGO, IL
                </span>
              </div>

              <div
                className="bg-[#0A0A0A]/95 border border-[#0016CB] px-3 py-1.5 rounded-md shadow-lg text-white"
                style={{ transform: 'translateZ(35px)' }}
              >
                <span className="text-[10px] text-[#99A9EE] uppercase block">DESTINATION &bull; 100% READY</span>
                <span className="font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  DALLAS, TX (1,150 MI)
                </span>
              </div>
            </div>

            <div className="flex justify-around items-end">
              <div
                className="bg-[#161616]/90 border border-[#242424] px-2.5 py-1 rounded text-[10px] text-slate-300 flex items-center gap-1.5"
                style={{ transform: 'translateZ(20px)' }}
              >
                <Fuel className="h-3 w-3 text-[#0016CB]" />
                <span>MILE 820 &bull; DIESEL STOP (30M)</span>
              </div>

              <div
                className="bg-[#161616]/90 border border-[#242424] px-2.5 py-1 rounded text-[10px] text-slate-300 flex items-center gap-1.5"
                style={{ transform: 'translateZ(20px)' }}
              >
                <Clock className="h-3 w-3 text-white" />
                <span>10H SLEEPER RESET PLANNED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Telemetry Selector */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-[#242424]">
          {waypoints.map((wp) => {
            const isSelected = activeNode === wp.id;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => setActiveNode(wp.id)}
                className={`p-2 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#161616] border-[#0016CB] text-white shadow-[0_0_15px_rgba(0,22,203,0.3)]'
                    : 'bg-[#0A0A0A] border-[#242424] text-slate-400 hover:text-white hover:border-[#374151]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="text-slate-500">{wp.code}</span>
                  <span className="text-[9px] text-[#99A9EE] font-bold">{wp.mile} mi</span>
                </div>
                <div className="text-[11px] font-bold truncate text-white">{wp.name}</div>
                <div className="text-[10px] text-slate-500 uppercase">{wp.type}</div>
              </button>
            );
          })}
        </div>

        {/* 3D Footer Live Telemetry Strip */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300">
              <Activity className="h-3.5 w-3.5 text-[#0016CB]" />
              <span>11H DRIVE CAP: <strong>8.5H USED</strong></span>
            </span>
            <span className="text-slate-600">/</span>
            <span>14H WINDOW: <strong>3.0H REMAINING</strong></span>
          </div>
          <div className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>0 HOS VIOLATIONS DETECTED</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
