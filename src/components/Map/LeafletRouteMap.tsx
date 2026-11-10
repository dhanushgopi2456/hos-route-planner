import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Stop, RouteLeg } from '../../types/hos';
import { Navigation, Clock, Fuel, Maximize2, Layers, MapPin, Compass, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

interface LeafletRouteMapProps {
  stops: Stop[];
  routeLegs: RouteLeg[];
  allCoordinates: [number, number][];
  className?: string;
  selectedStopId?: string | null;
  onSelectStop?: (stop: Stop) => void;
  totalDistance?: number;
  drivingHours?: number;
  totalDuration?: number;
  isLoading?: boolean;
}

type MapTileStyle = 'dark' | 'street' | 'satellite';

interface TileProviderConfig {
  baseUrl: string;
  referenceUrl?: string;
  attribution: string;
  maxZoom: number;
}

// 100% Free, Reliable Commercial GIS Tile Layers (Zero API Key Watermarks, Worldwide Coverage)
const TILE_PROVIDERS: Record<MapTileStyle, TileProviderConfig> = {
  dark: {
    baseUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    referenceUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Commercial Freight Dark Canvas',
    maxZoom: 16
  },
  street: {
    baseUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, DeLorme, NAVTEQ, USGS &mdash; Street Logistics',
    maxZoom: 19
  },
  satellite: {
    baseUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Earthstar Geographics &mdash; Satellite Ortho',
    maxZoom: 18
  }
};

export const LeafletRouteMap: React.FC<LeafletRouteMapProps> = ({
  stops,
  routeLegs,
  allCoordinates,
  className = 'h-[520px] w-full',
  selectedStopId,
  onSelectStop,
  totalDistance,
  drivingHours,
  totalDuration,
  isLoading = false
}) => {
  const { resolvedTheme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const refTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Default tile style follows theme: dark mode -> dark tiles; light mode -> street tiles
  const [activeStyle, setActiveStyle] = useState<MapTileStyle>(() => (resolvedTheme === 'light' ? 'street' : 'dark'));

  // Sync tile provider with theme changes unless user explicitly switched
  useEffect(() => {
    if (activeStyle === 'dark' && resolvedTheme === 'light') {
      handleSwitchStyle('street');
    } else if (activeStyle === 'street' && resolvedTheme === 'dark') {
      handleSwitchStyle('dark');
    }
  }, [resolvedTheme]);

  // Apply tile layer
  const applyTileLayer = useCallback((style: MapTileStyle) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (refTileLayerRef.current) {
      map.removeLayer(refTileLayerRef.current);
      refTileLayerRef.current = null;
    }

    const provider = TILE_PROVIDERS[style];
    const base = L.tileLayer(provider.baseUrl, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      subdomains: 'abcd'
    }).addTo(map);
    tileLayerRef.current = base;

    // If provider has reference labels layer (like Esri Dark Canvas Reference), add it on top
    if (provider.referenceUrl) {
      const refLayer = L.tileLayer(provider.referenceUrl, {
        maxZoom: provider.maxZoom,
        subdomains: 'abcd',
        opacity: 0.95
      }).addTo(map);
      refTileLayerRef.current = refLayer;
    }
  }, []);

  const handleSwitchStyle = (style: MapTileStyle) => {
    setActiveStyle(style);
    applyTileLayer(style);
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [39.8283, -98.5795], // Default continental US center
        zoom: 4,
        zoomControl: false,
        attributionControl: false
      });

      // Custom clean zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Attribution control at bottom right (compact)
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);

      applyTileLayer(activeStyle);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ResizeObserver: Fix black square tiles & container clipping permanently
  useEffect(() => {
    const map = mapInstanceRef.current;
    const container = mapContainerRef.current;
    if (!map || !container) return;

    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(container);

    // Initial multi-stage invalidation to handle tab mounts & transitions
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 350);
    const t3 = setTimeout(() => map.invalidateSize(), 700);

    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Fit bounds helper
  const handleFitRoute = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = L.latLngBounds([]);
    if (allCoordinates && allCoordinates.length > 0) {
      allCoordinates.forEach(c => {
        if (c && typeof c[0] === 'number' && typeof c[1] === 'number') {
          bounds.extend([c[0], c[1]]);
        }
      });
    }
    stops.forEach(s => {
      if (s.location?.lat && s.location?.lng) {
        bounds.extend([s.location.lat, s.location.lng]);
      }
    });

    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.2, maxZoom: 12 });
    }
  }, [allCoordinates, stops]);

  // Jump to specific stop
  const handleJumpToStop = (stop: Stop) => {
    const map = mapInstanceRef.current;
    if (!map || !stop.location?.lat || !stop.location?.lng) return;

    map.flyTo([stop.location.lat, stop.location.lng], 12, {
      animate: true,
      duration: 1.2
    });

    const marker = markersRef.current.get(stop.id);
    if (marker) {
      marker.openPopup();
    }

    if (onSelectStop) {
      onSelectStop(stop);
    }
  };

  // Render Route and Waypoint Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    markersRef.current.clear();

    const bounds = L.latLngBounds([]);

    // 1. Draw glowing multi-segment route polyline
    if (routeLegs && routeLegs.length > 0) {
      routeLegs.forEach((leg, idx) => {
        if (!leg.geometry || leg.geometry.length === 0) return;

        // Outer ambient glow halo
        L.polyline(leg.geometry, {
          color: idx === 0 ? '#0052FF' : '#3346D7',
          weight: 8,
          opacity: 0.45,
          lineJoin: 'round'
        }).addTo(layerGroup);

        // Core bright highway polyline
        const polyline = L.polyline(leg.geometry, {
          color: idx === 0 ? '#0052FF' : '#22D3EE',
          weight: 4,
          opacity: 0.95,
          lineJoin: 'round'
        });

        polyline.bindTooltip(
          `<div class="font-mono text-xs p-1"><strong>Leg ${idx + 1}:</strong> ${leg.from.name} → ${leg.to.name}<br/><span class="text-blue-400 font-bold">${leg.distance_miles} mi (${leg.driving_hours}h driving)</span></div>`,
          { sticky: true }
        );

        polyline.addTo(layerGroup);
      });
    } else if (allCoordinates && allCoordinates.length > 0) {
      // Single continuous route polyline
      L.polyline(allCoordinates, {
        color: '#0052FF',
        weight: 8,
        opacity: 0.4
      }).addTo(layerGroup);

      const polyline = L.polyline(allCoordinates, {
        color: '#38BDF8',
        weight: 4,
        opacity: 0.95
      });
      polyline.addTo(layerGroup);
    }

    // 2. Draw Stop markers with pulsating radar beacons
    stops.forEach((stop, index) => {
      const { lat, lng } = stop.location || {};
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

      bounds.extend([lat, lng]);

      const isSelected = stop.id === selectedStopId;
      const icon = createCustomMarkerIcon(stop.type, isSelected, index + 1);
      const marker = L.marker([lat, lng], { icon });

      markersRef.current.set(stop.id, marker);

      const formatTime = (iso: string) => {
        try {
          const d = new Date(iso);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        } catch {
          return iso;
        }
      };

      const popupHtml = `
        <div class="p-2 font-sans text-slate-100 text-xs max-w-xs">
          <div class="flex items-center gap-1.5 font-bold text-sm text-white border-b border-slate-700 pb-1.5 mb-2 font-display">
            <span class="inline-block w-2.5 h-2.5 rounded-full ${getStopColorClass(stop.type)}"></span>
            <span>${getStopTypeTitle(stop.type)}</span>
          </div>
          <p class="font-semibold text-white mb-2">${stop.location.name}</p>
          <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-300 mb-2 font-mono text-[11px]">
            <div><span class="text-slate-500">Arrival:</span> ${formatTime(stop.arrival_time)}</div>
            <div><span class="text-slate-500">Depart:</span> ${formatTime(stop.departure_time)}</div>
            <div><span class="text-slate-500">Duration:</span> ${stop.duration_hours}h</div>
            <div><span class="text-slate-500">Trip Mile:</span> ${Math.round(stop.distance_from_start_miles)} mi</div>
          </div>
          <div class="bg-slate-800/80 border border-slate-700 rounded-lg p-2 mb-1.5 text-slate-300">
            <span class="font-medium text-slate-400">Activity:</span> ${stop.reason}
          </div>
          <div class="text-[11px] text-blue-300 bg-blue-950/60 border border-blue-800/80 rounded-lg p-1.5 font-mono">
            <strong>HOS Impact:</strong> ${stop.hos_impact}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { minWidth: 240 });

      marker.on('click', () => {
        if (onSelectStop) onSelectStop(stop);
      });

      marker.addTo(layerGroup);
    });

    // Auto-fit bounds smoothly
    if (allCoordinates && allCoordinates.length > 0) {
      allCoordinates.forEach(c => {
        if (c && typeof c[0] === 'number' && typeof c[1] === 'number') {
          bounds.extend([c[0], c[1]]);
        }
      });
    }

    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.2, maxZoom: 12 });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [stops, routeLegs, allCoordinates, selectedStopId, onSelectStop]);

  // Derived telemetry metrics
  const calculatedDistance = totalDistance ?? stops.reduce((acc, s) => Math.max(acc, s.distance_from_start_miles || 0), 0);
  const calculatedDriveHours = drivingHours ?? (calculatedDistance / 60);
  const calculatedStopsCount = stops.length;

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${className}`}>
      {/* Map DOM mount container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Calculating Radar Pulse Scanline Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-950/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="relative w-28 h-28 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-cyan-400/80 animate-ping" />
              <span className="absolute inset-4 rounded-full border border-blue-500/60 animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Compass className="w-6 h-6 animate-spin" />
              </div>
            </div>
            <p className="mt-3 text-xs font-mono font-bold text-white tracking-widest uppercase bg-black/60 px-3 py-1 rounded-full border border-cyan-400/40">
              Calculating Highway Telemetry &amp; Stop Constraints...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Telemetry Overlay (Top Left) */}
      <div className="absolute top-3 left-3 z-10 pointer-events-auto">
        <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-xl flex items-center gap-3 sm:gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 border-r border-white/15 pr-3">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-tight">TOTAL HAUL</span>
              <span className="font-bold text-white">{calculatedDistance.toFixed(0)} mi</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-r border-white/15 pr-3">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-tight">DRIVING</span>
              <span className="font-bold text-white">{calculatedDriveHours.toFixed(1)} hrs</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Fuel className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-tight">STOPS</span>
              <span className="font-bold text-white">{calculatedStopsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tile Layer & View Controls (Top Right) */}
      <div className="absolute top-3 right-3 z-10 pointer-events-auto flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleFitRoute}
          className="px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xl cursor-pointer"
          title="Zoom & Fit Route Bounds"
        >
          <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Fit Route</span>
        </motion.button>

        {/* Tile Style Picker */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-xl">
          {(['dark', 'street', 'satellite'] as MapTileStyle[]).map(style => (
            <button
              key={style}
              type="button"
              onClick={() => handleSwitchStyle(style)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer ${
                activeStyle === style
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Stop Quick Jump Carousel (Bottom Left) */}
      {stops.length > 0 && (
        <div className="absolute bottom-3 left-3 right-20 z-10 pointer-events-auto overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded-md shrink-0 border border-white/10">
              JUMP TO:
            </span>
            {stops.map((stop, idx) => {
              const isSelected = stop.id === selectedStopId;
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => handleJumpToStop(stop)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold ring-2 ring-white/50 shadow-md'
                      : 'bg-slate-950/85 hover:bg-slate-800 text-slate-200 border border-white/15'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${getStopColorClass(stop.type)}`} />
                  <span>{idx + 1}. {stop.location.city || stop.location.name.split(',')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend Badge (Bottom Right) */}
      <div className="absolute bottom-12 right-3 z-10 pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-white/15 rounded-xl p-2.5 shadow-xl hidden sm:flex flex-col gap-1 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shadow-blue-500" />
          <span className="text-slate-300 font-medium">Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500" />
          <span className="text-slate-300 font-medium">Pickup (1h)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs shadow-rose-500" />
          <span className="text-slate-300 font-medium">Dropoff (1h)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500" />
          <span className="text-slate-300 font-medium">Fuel Stop</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs shadow-purple-500" />
          <span className="text-slate-300 font-medium">30m Break</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500" />
          <span className="text-slate-300 font-medium">10h Sleep</span>
        </div>
      </div>
    </div>
  );
};

function getStopColorClass(type: string): string {
  switch (type) {
    case 'CURRENT': return 'bg-blue-500';
    case 'PICKUP': return 'bg-emerald-500';
    case 'DROPOFF': return 'bg-rose-500';
    case 'FUEL': return 'bg-amber-500';
    case 'REST_BREAK': return 'bg-purple-500';
    case 'SLEEPER': return 'bg-indigo-500';
    default: return 'bg-slate-500';
  }
}

function getStopTypeTitle(type: string): string {
  switch (type) {
    case 'CURRENT': return 'Trip Origin (Home Terminal)';
    case 'PICKUP': return 'Shipper Pickup Loading (1h)';
    case 'DROPOFF': return 'Receiver Delivery Unloading (1h)';
    case 'FUEL': return 'Commercial Diesel Fuel Stop (30m)';
    case 'REST_BREAK': return 'Mandatory 30-Min Rest Break';
    case 'SLEEPER': return '10-Hour Sleeper Berth Daily Reset';
    default: return 'Scheduled Stop';
  }
}

function createCustomMarkerIcon(type: string, isSelected: boolean, stopNumber?: number): L.DivIcon {
  let bgColor = '#0052FF';
  let letter = 'O';

  switch (type) {
    case 'CURRENT':
      bgColor = '#0052FF';
      letter = 'O';
      break;
    case 'PICKUP':
      bgColor = '#10B981';
      letter = 'P';
      break;
    case 'DROPOFF':
      bgColor = '#EF4444';
      letter = 'D';
      break;
    case 'FUEL':
      bgColor = '#F59E0B';
      letter = 'F';
      break;
    case 'REST_BREAK':
      bgColor = '#8B5CF6';
      letter = 'B';
      break;
    case 'SLEEPER':
      bgColor = '#6366F1';
      letter = 'S';
      break;
  }

  const ringStyle = isSelected
    ? 'ring-4 ring-cyan-400 scale-125 shadow-cyan-400/50'
    : 'ring-2 ring-white/90 shadow-black/80';

  const html = `
    <div class="relative w-8 h-8 flex items-center justify-center">
      <span style="background-color: ${bgColor};" class="absolute w-full h-full rounded-full opacity-60 animate-ping pointer-events-none"></span>
      <div style="background-color: ${bgColor};" class="relative z-10 w-7 h-7 rounded-full shadow-lg flex items-center justify-center text-white font-black text-xs font-mono ${ringStyle} transition-transform">
        ${letter}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}
