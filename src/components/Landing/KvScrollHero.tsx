import React, { useEffect, useRef, useState, useCallback } from 'react';

interface KvScrollHeroProps {
  onLaunchPlanner?: (demo?: boolean, tab?: string) => void;
}

const VIDEO_DURATION = 4.04;
const A_VIEWPORTS = 2.4;
const VIDEO_ASPECT = 1920 / 1080;

interface ServiceCardData {
  id: string;
  tab: string;
  title: string;
  body: string;
  badge: string;
  icon: React.ReactNode;
}

const SERVICE_CARDS: ServiceCardData[] = [
  {
    id: 'air',
    tab: 'summary',
    title: 'Air\nFreight',
    body: 'Express, priority and deferred options across global lanes, booked and tracked end to end.',
    badge: 'EXPEDITED • 11H DRIVE LOCK',
    icon: (
      <svg className="w-full h-full stroke-white fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 20.5 3c-1-1-3-.5-4.5 1L12.5 7.5 4.3 5.7c-.5-.1-.9.1-1.2.4l-.8.8c-.3.3-.3.8 0 1.1l5.7 4.2-3.3 3.3-2.5-.5c-.3-.1-.7.1-.9.3l-.5.5c-.3.3-.3.7 0 1 1 1 2.5 1.5 3.7 1.5.8 0 1.6-.2 2.3-.5l3.3-3.3 4.2 5.7c.3.3.8.3 1.1 0l.8-.8c.3-.3.5-.7.4-1.2z" />
      </svg>
    ),
  },
  {
    id: 'ocean',
    tab: 'map',
    title: 'Ocean\nFreight',
    body: 'FCL and LCL sailings on every major trade lane, with carrier choice based on cost and transit time.',
    badge: 'PORT DRAYAGE • 14H WINDOW',
    icon: (
      <svg className="w-full h-full stroke-white fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
        <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1" />
        <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7" />
        <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
        <path d="M12 10V2" />
        <path d="M12 2h5" />
      </svg>
    ),
  },
  {
    id: 'customs',
    tab: 'compliance',
    title: 'Customs\nBrokerage',
    body: 'Licensed in-house brokers for classification, duties and inspections, so goods clear first time.',
    badge: 'FMCSA & CBP VERIFIED',
    icon: (
      <svg className="w-full h-full stroke-white fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'warehousing',
    tab: 'eld',
    title: 'Warehousing\nAnd 3PL',
    body: 'Bonded and general storage, pick and pack, and distribution that plugs straight into transport.',
    badge: 'ELD AUTOMATION • 70H / 8-DAY',
    icon: (
      <svg className="w-full h-full stroke-white fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
        <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-4a2 2 0 0 1 1.48 0l8 4A2 2 0 0 1 22 8.35z" />
        <path d="M6 18h12" />
        <path d="M6 14h12" />
        <rect x="9" y="11" width="6" height="11" />
      </svg>
    ),
  },
  {
    id: 'project',
    tab: 'timeline',
    title: 'Project\nCargo',
    body: 'Oversized and heavy-lift moves, engineered, permitted and escorted from factory to foundation.',
    badge: '1,000-MILE FUEL STOPS',
    icon: (
      <svg className="w-full h-full stroke-white fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
        <path d="M3 21h18" />
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        <path d="M9 3v4" />
        <path d="M15 3v4" />
        <path d="m14 13-2 2-2-2" />
        <path d="M12 9v6" />
        <rect x="8" y="17" width="8" height="4" rx="1" />
      </svg>
    ),
  },
];

export const KvScrollHero: React.FC<KvScrollHeroProps> = ({ onLaunchPlanner }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrcRef = useRef<HTMLSourceElement>(null);
  const giantLettersRef = useRef<HTMLDivElement>(null);
  const speedReadoutRef = useRef<HTMLDivElement>(null);
  const groundBandRef = useRef<HTMLDivElement>(null);
  const sceneBgBlackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [settled, setSettled] = useState<boolean>(false);
  const [speedText, setSpeedText] = useState<string>('00 KM/H');

  // Animation mutable state
  const stateRef = useRef({
    vw: typeof window !== 'undefined' ? window.innerWidth : 1440,
    vh: typeof window !== 'undefined' ? window.innerHeight : 960,
    bViewports: 2.0,
    trackHeight: 3000,
    stripWidth: 2000,
    lettersWidth: 1600,
    edgePx: 0,
    videoTop: 0,
    videoH: 0,
    curTime: 0,
    targetTime: 0,
    lastScrollY: 0,
    lastTime: performance.now(),
    smoothedSpeed: 0,
    isSeeking: false,
    pendingSeek: null as number | null,
    rafId: 0,
  });

  const checkVideoSource = useCallback(() => {
    const video = videoRef.current;
    const videoSrc = videoSrcRef.current;
    if (!video || !videoSrc) return;

    const isMobileWidth = window.innerWidth <= 900;
    const currentSrc = video.currentSrc || videoSrc.src;
    const targetUrl = isMobileWidth
      ? 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b3718419-7a0a-478d-bfb0-0ff8bef7f3f7.mp4'
      : 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/409763c0-95f4-49d3-a601-dc564d55072b.mp4';

    if (!currentSrc.includes(targetUrl.split('/').pop() || '')) {
      const t = video.currentTime;
      videoSrc.src = targetUrl;
      video.load();
      video.currentTime = t;
    }
  }, []);

  const computeLayout = useCallback(() => {
    const s = stateRef.current;
    const video = videoRef.current;
    const track = trackRef.current;
    const groundBand = groundBandRef.current;
    const sceneBgBlack = sceneBgBlackRef.current;
    const strip = stripRef.current;
    const giantLetters = giantLettersRef.current;

    s.vw = window.innerWidth;
    s.vh = window.innerHeight;
    const isNarrow = s.vw < 768 || s.vw <= s.vh;

    let videoW = 0;
    let videoH = 0;
    let videoLeft = 0;
    let videoTop = 0;

    if (!isNarrow) {
      const screenAspect = s.vw / s.vh;
      if (screenAspect > VIDEO_ASPECT) {
        videoW = s.vw;
        videoH = s.vw / VIDEO_ASPECT;
      } else {
        videoH = s.vh;
        videoW = s.vh * VIDEO_ASPECT;
      }
      videoLeft = (s.vw - videoW) / 2;
      videoTop = (s.vh - videoH) / 2;
    } else {
      videoW = 1.55 * s.vw;
      videoH = videoW / VIDEO_ASPECT;
      videoLeft = 0.5 * s.vw - 0.40 * videoW;
      videoTop = 0.36 * s.vh - 0.448 * videoH;
    }

    if (video) {
      video.style.width = `${videoW}px`;
      video.style.height = `${videoH}px`;
      video.style.transform = `translate(${videoLeft}px, ${videoTop}px)`;
    }

    s.videoTop = videoTop;
    s.videoH = videoH;

    // Dynamic ground line: 82.9% (0.829) until 3.1s, rising to 44.8% (0.448) by 3.75s
    let groundFrac = 0.829;
    if (s.curTime > 3.1 && s.curTime < 3.75) {
      const p = (s.curTime - 3.1) / (3.75 - 3.1);
      groundFrac = 0.829 + p * (0.448 - 0.829);
    } else if (s.curTime >= 3.75) {
      groundFrac = 0.448;
    }

    s.edgePx = videoTop + groundFrac * videoH;
    document.documentElement.style.setProperty('--edge-px', `${s.edgePx}px`);

    if (groundBand) {
      groundBand.style.top = `${s.edgePx}px`;
      groundBand.style.height = `${Math.max(0, s.vh - s.edgePx)}px`;
    }
    if (sceneBgBlack) {
      sceneBgBlack.style.top = `${s.edgePx}px`;
    }

    if (strip) {
      s.stripWidth = strip.scrollWidth;
    }
    if (giantLetters) {
      s.lettersWidth = giantLetters.scrollWidth;
    }

    s.bViewports = ((s.stripWidth + 0.45 * s.vw) / s.vw) * 1.1;
    s.trackHeight = (1 + A_VIEWPORTS + s.bViewports) * s.vh;

    if (track) {
      track.style.height = `${s.trackHeight}px`;
    }

    checkVideoSource();
  }, [checkVideoSource]);

  const updateCardGradients = useCallback((stripX: number) => {
    const s = stateRef.current;
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const cardOffsetLeft = card.offsetLeft;
      const cardLeft = stripX + cardOffsetLeft;
      const sProgress = Math.min(1.6, Math.max(-0.4, (0.98 - cardLeft / s.vw) / 0.3)) * 100;

      const titleEl = card.querySelector('.kv-card-title') as HTMLElement | null;
      const bodyEl = card.querySelector('.kv-card-body') as HTMLElement | null;

      const grad = `linear-gradient(90deg, #ffffff 0%, #ffffff ${sProgress - 34}%, #2f63ff ${sProgress - 6}%, rgba(255,255,255,0) ${sProgress + 26}%)`;
      if (titleEl) titleEl.style.backgroundImage = grad;
      if (bodyEl) bodyEl.style.backgroundImage = grad;
    });
  }, []);

  const applyVideoSeek = useCallback((target: number) => {
    const video = videoRef.current;
    const s = stateRef.current;
    if (!video) return;

    if (!s.isSeeking) {
      if (Math.abs(video.currentTime - target) > 1 / 60) {
        video.currentTime = target;
      }
    } else {
      s.pendingSeek = target;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const s = stateRef.current;

    const onSeeking = () => {
      s.isSeeking = true;
    };

    const onSeeked = () => {
      s.isSeeking = false;
      if (s.pendingSeek !== null) {
        const next = s.pendingSeek;
        s.pendingSeek = null;
        if (video && Math.abs(video.currentTime - next) > 1 / 60) {
          video.currentTime = next;
        }
      }
    };

    if (video) {
      video.addEventListener('seeking', onSeeking);
      video.addEventListener('seeked', onSeeked);
    }

    const onFrame = (now: number) => {
      const sy = window.scrollY;
      const dt = Math.max(1, now - s.lastTime);
      const dy = Math.abs(sy - s.lastScrollY);

      const instantSpeed = (dy / (dt / 1000)) / 32;
      s.smoothedSpeed += (instantSpeed - s.smoothedSpeed) * 0.15;
      if (dy === 0) {
        s.smoothedSpeed += (0 - s.smoothedSpeed) * 0.2;
      }
      const displaySpeed = Math.min(99, Math.max(0, Math.round(s.smoothedSpeed)));
      if (speedReadoutRef.current) {
        speedReadoutRef.current.textContent = `${String(displaySpeed).padStart(2, '0')} KM/H`;
      }

      s.lastScrollY = sy;
      s.lastTime = now;

      // Track relative scroll position:
      // When KV Hero is embedded on the page, calculate offset relative to trackRef
      let relScroll = sy;
      if (trackRef.current) {
        const trackTop = trackRef.current.offsetTop;
        relScroll = Math.max(0, sy - trackTop);
      }

      const q = Math.min(1, Math.max(0, relScroll / (A_VIEWPORTS * s.vh)));
      const maxTime = Math.max(0, VIDEO_DURATION - 1 / 48);
      s.targetTime = q * maxTime;

      s.curTime += (s.targetTime - s.curTime) * 0.2;
      applyVideoSeek(s.curTime);

      // Update dynamic ground edge as video scrubs (ground line rises from 82.9% to 44.8%)
      let groundFrac = 0.829;
      if (s.curTime > 3.1 && s.curTime < 3.75) {
        const p = (s.curTime - 3.1) / (3.75 - 3.1);
        groundFrac = 0.829 + p * (0.448 - 0.829);
      } else if (s.curTime >= 3.75) {
        groundFrac = 0.448;
      }

      if (s.videoH > 0) {
        s.edgePx = s.videoTop + groundFrac * s.videoH;
        document.documentElement.style.setProperty('--edge-px', `${s.edgePx}px`);
        if (groundBandRef.current) {
          groundBandRef.current.style.top = `${s.edgePx}px`;
          groundBandRef.current.style.height = `${Math.max(0, s.vh - s.edgePx)}px`;
        }
        if (sceneBgBlackRef.current) {
          sceneBgBlackRef.current.style.top = `${s.edgePx}px`;
        }
      }

      const isSettled = q >= 0.94;
      setSettled(isSettled);
      document.documentElement.style.setProperty('--ph', isSettled ? '1' : '0');

      const r = Math.min(1, Math.max(0, (relScroll - A_VIEWPORTS * s.vh) / (s.bViewports * s.vh)));

      const stripX = s.vw - r * (s.stripWidth + 0.45 * s.vw);
      if (stripRef.current) {
        stripRef.current.style.transform = `translateX(${stripX}px)`;
      }

      if (giantLettersRef.current) {
        const lettersX = s.vw - r * (s.lettersWidth + s.vw);
        const lettersFontSize = parseFloat(getComputedStyle(giantLettersRef.current).fontSize) || 200;
        const lettersY = s.edgePx - lettersFontSize * 0.8;
        giantLettersRef.current.style.transform = `translate(${lettersX}px, ${lettersY}px)`;
      }

      updateCardGradients(stripX);

      s.rafId = requestAnimationFrame(onFrame);
    };

    computeLayout();
    s.rafId = requestAnimationFrame(onFrame);

    // Support Recorder mode (?rec=1)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('rec') === '1') {
        (window as unknown as { __recTime: (vid: HTMLVideoElement, t: number) => number }).__recTime = (vid: HTMLVideoElement, t: number) => {
          const totalDur = 11.0;
          const pNorm = Math.min(1, Math.max(0, t / totalDur));
          let prog = 0;
          if (pNorm <= 0.04) {
            prog = 0;
          } else if (pNorm >= 0.96) {
            prog = 1;
          } else {
            const u = (pNorm - 0.04) / 0.92;
            prog = u * u * (3 - 2 * u);
          }
          const targetScrollY = prog * (s.trackHeight - s.vh);
          window.scrollTo(0, targetScrollY);
          const scriptedSpeed = Math.round(prog > 0.05 && prog < 0.95 ? 42 + Math.sin(prog * Math.PI) * 28 : 0);
          setSpeedText(`${String(scriptedSpeed).padStart(2, '0')} KM/H`);
          return vid.currentTime;
        };
      }
    }

    const onResize = () => {
      computeLayout();
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(s.rafId);
      window.removeEventListener('resize', onResize);
      if (video) {
        video.removeEventListener('seeking', onSeeking);
        video.removeEventListener('seeked', onSeeked);
      }
    };
  }, [applyVideoSeek, computeLayout, updateCardGradients]);

  return (
    <div
      ref={trackRef}
      id="crane-sequence"
      className="relative w-full bg-white select-none overflow-visible"
      style={{
        // Define fluid unit: u = min(100vw/1440, 100vh/960)
        '--u': 'min(100vw / 1440, 100vh / 960)',
      } as React.CSSProperties}
    >
      {/* Sticky Scene Container */}
      <div
        ref={sceneRef}
        className="sticky top-0 left-0 w-screen h-screen overflow-hidden bg-white"
        style={{ height: '100lvh' }}
      >
        {/* Black background band below edge-px */}
        <div
          ref={sceneBgBlackRef}
          className="absolute left-0 w-full bottom-0 bg-[#111111] z-0 pointer-events-none"
        />

        {/* Video: Frame-accurate scrubbed freight clip */}
        <video
          ref={videoRef}
          className="absolute top-0 left-0 pointer-events-none select-none z-[1] will-change-transform"
          muted
          playsInline
          preload="auto"
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/2307e4bf-be39-42b4-b579-e168aeccabf0.jpg"
        >
          <source
            ref={videoSrcRef}
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/409763c0-95f4-49d3-a601-dc564d55072b.mp4"
            type="video/mp4"
          />
        </video>

        {/* Giant letters "OUR SERVICES" in Anton with mix-blend-mode: darken */}
        <div
          ref={giantLettersRef}
          className="absolute top-0 left-0 font-['Anton',sans-serif] text-[#e9e9e9] whitespace-nowrap z-[2] pointer-events-none select-none will-change-transform"
          style={{
            fontSize: 'calc(330 * var(--u))',
            lineHeight: 0.8,
            mixBlendMode: 'darken',
          }}
        >
          OUR SERVICES
        </div>

        {/* Smoothed Speed Readout in Mono (top-left 26u, 52u) */}
        <div
          ref={speedReadoutRef}
          className={`absolute font-['JetBrains_Mono',monospace] text-[#111111] z-[15] pointer-events-none tracking-wider transition-all duration-300 ${
            settled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
          style={{
            top: 'calc(26 * var(--u))',
            left: 'calc(52 * var(--u))',
            fontSize: 'calc(10.5 * var(--u))',
          }}
        >
          {speedText}
        </div>

        {/* Dark Ground Band: From edge-px to bottom holding the sliding cards */}
        <div
          ref={groundBandRef}
          className="absolute left-0 w-screen bg-[#111111] z-[3] overflow-hidden"
        >
          {/* Horizontal Sliding Strip */}
          <div
            ref={stripRef}
            className="absolute left-0 flex items-start text-white whitespace-nowrap will-change-transform"
            style={{
              top: 'calc(76 * var(--u))',
              gap: 'calc(120 * var(--u))',
            }}
          >
            {/* Lead Block */}
            <div
              className="flex items-start shrink-0"
              style={{ gap: 'calc(64 * var(--u))' }}
            >
              <h2
                className="font-['Anton',sans-serif] uppercase text-white tracking-tight leading-[0.98]"
                style={{ fontSize: 'calc(64 * var(--u))' }}
              >
                EVERYTHING YOUR<br />
                FREIGHT NEEDS.<br />
                <span className="text-[#2f63ff] block">UNDER ONE GROUP.</span>
              </h2>

              <div
                className="flex flex-col font-['Archivo',sans-serif] text-white/60 leading-relaxed whitespace-normal"
                style={{
                  width: 'calc(250 * var(--u))',
                  gap: 'calc(14 * var(--u))',
                  fontSize: 'calc(12 * var(--u))',
                }}
              >
                <p>
                  From air to sea, from customs clearance to the last mile, we bring decades of practice to every freight discipline.
                </p>
                <p>
                  One integrated network means one partner, one point of contact and full visibility from origin to destination.
                </p>
              </div>
            </div>

            {/* Five Service Cards */}
            {SERVICE_CARDS.map((card, idx) => (
              <div
                key={card.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onClick={() => onLaunchPlanner?.(true, card.tab)}
                className={`group flex flex-col shrink-0 whitespace-normal cursor-pointer transition-transform duration-200 hover:-translate-y-1 ${
                  idx === 0 ? 'border-l-0 pl-0' : 'border-l border-white/12'
                }`}
                style={{
                  width: 'calc(270 * var(--u))',
                  paddingLeft: idx === 0 ? 0 : 'calc(30 * var(--u))',
                  paddingRight: 'calc(30 * var(--u))',
                  gap: 'calc(18 * var(--u))',
                }}
              >
                {/* Micro Badge */}
                <span
                  className="font-['Archivo',sans-serif] text-[#2f63ff] tracking-widest uppercase font-semibold block"
                  style={{ fontSize: 'calc(8.5 * var(--u))' }}
                >
                  {card.badge}
                </span>

                {/* 38u Line Icon */}
                <div
                  className="transition-transform duration-300 group-hover:scale-110 group-hover:stroke-[#2f63ff]"
                  style={{
                    width: 'calc(38 * var(--u))',
                    height: 'calc(38 * var(--u))',
                  }}
                >
                  {card.icon}
                </div>

                {/* Title with cobalt shimmer text gradient */}
                <h3
                  className="kv-card-title font-['Anton',sans-serif] uppercase tracking-wide leading-tight bg-clip-text text-transparent"
                  style={{
                    fontSize: 'calc(26 * var(--u))',
                    backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #2f63ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {card.title.split('\n').map((line, lIdx) => (
                    <span key={lIdx} className="block">{line}</span>
                  ))}
                </h3>

                {/* Body with cobalt shimmer text gradient */}
                <p
                  className="kv-card-body font-['Archivo',sans-serif] text-sm leading-relaxed bg-clip-text text-transparent"
                  style={{
                    fontSize: 'calc(12.4 * var(--u))',
                    backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #2f63ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {card.body}
                </p>

                {/* Action Trigger Arrow */}
                <div
                  className="inline-flex items-center gap-1.5 font-['Archivo',sans-serif] text-[#2f63ff] group-hover:text-white transition-colors uppercase tracking-widest font-medium"
                  style={{ fontSize: 'calc(9.5 * var(--u))' }}
                >
                  <span>Plan Route</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Outline Pill "Our services" */}
          <button
            type="button"
            onClick={() => onLaunchPlanner?.(true, 'summary')}
            className={`absolute left-1/2 -translate-x-1/2 font-['Archivo',sans-serif] font-medium uppercase tracking-widest text-white border border-white/30 rounded-full transition-all duration-300 hover:border-[#2f63ff] hover:bg-[#2f63ff]/15 z-10 cursor-pointer ${
              settled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{
              bottom: 'calc(36 * var(--u))',
              fontSize: 'calc(10.5 * var(--u))',
              padding: 'calc(8 * var(--u)) calc(22 * var(--u))',
            }}
          >
            Our services
          </button>

          {/* Direct CTA pill to Launch Planner */}
          <button
            type="button"
            onClick={() => onLaunchPlanner?.(false)}
            className={`absolute font-['Archivo',sans-serif] font-medium uppercase tracking-widest text-[#2f63ff] border border-[#2f63ff]/40 bg-[#111111]/80 rounded-full transition-all duration-300 hover:bg-[#2f63ff] hover:text-white z-10 cursor-pointer ${
              settled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{
              bottom: 'calc(36 * var(--u))',
              right: 'calc(52 * var(--u))',
              fontSize: 'calc(10.5 * var(--u))',
              padding: 'calc(8 * var(--u)) calc(20 * var(--u))',
            }}
          >
            Launch HOS Engine →
          </button>
        </div>
      </div>
    </div>
  );
};
