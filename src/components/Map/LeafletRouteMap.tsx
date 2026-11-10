import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Stop, RouteLeg } from '../../types/hos';
import { Navigation, Clock, Fuel, Maximize2, Layers, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

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
}

type MapTileStyle = 'dark' | 'street' | 'satellite';

const TILE_PROVIDERS: Record<MapTileStyle, { url: string; attribution: string; maxZoom: number }> = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Earthstar Geographics',
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
  totalDuration
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const [activeStyle, setActiveStyle] = useState<MapTileStyle>('dark');

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [39.8283, -98.5795], // Center of US
        zoom: 4,
        zoomControl: false
      });

      // Zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Base tile layer
      const provider = TILE_PROVIDERS['dark'];
      const tileLayer = L.tileLayer(provider.url, {
        attribution: provider.attribution,
        maxZoom: provider.maxZoom,
        subdomains: 'abcd'
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile provider when style changes
  const handleSwitchStyle = (style: MapTileStyle) => {
    setActiveStyle(style);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const provider = TILE_PROVIDERS[style];
    const newLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      subdomains: 'abcd'
    }).addTo(map);

    tileLayerRef.current = newLayer;
  };

  // Recenter and fit bounds
  const handleFitRoute = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = L.latLngBounds([]);
    if (allCoordinates && allCoordinates.length > 0) {
      allCoordinates.forEach(c => bounds.extend(c));
    }
    stops.forEach(s => {
      if (s.location.lat && s.location.lng) bounds.extend([s.location.lat, s.location.lng]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true });
    }
  };

  // Jump to specific stop
  const handleJumpToStop = (stop: Stop) => {
    const map = mapInstanceRef.current;
    if (!map || !stop.location.lat || !stop.location.lng) return;

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

  // Update layers when stops or routeLegs change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    markersRef.current.clear();

    // 1. Draw glowing route polylines
    if (routeLegs && routeLegs.length > 0) {
      routeLegs.forEach((leg, idx) => {
        // Outer glowing halo
        L.polyline(leg.geometry, {
          color: idx === 0 ? '#0016CB' : '#3346D7',
          weight: 8,
          opacity: 0.45,
          lineJoin: 'round'
        }).addTo(layerGroup);

        // Core bright line
        const polyline = L.polyline(leg.geometry, {
          color: idx === 0 ? '#0016CB' : '#6677E3',
          weight: 4,
          opacity: 0.98,
          lineJoin: 'round'
        });

        polyline.bindTooltip(
          `<div class="font-mono text-xs p-1"><strong>Leg ${idx + 1}:</strong> ${leg.from.name} → ${leg.to.name}<br/><span class="text-blue-400 font-bold">${leg.distance_miles} mi (${leg.driving_hours}h driving)</span></div>`,
          { sticky: true }
        );

        polyline.addTo(layerGroup);
      });
    } else if (allCoordinates && allCoordinates.length > 0) {
      // Glow halo
      L.polyline(allCoordinates, {
        color: '#0016CB',
        weight: 8,
        opacity: 0.45
      }).addTo(layerGroup);

      // Core line
      const polyline = L.polyline(allCoordinates, {
        color: '#3346D7',
        weight: 4,
        opacity: 0.98
      });
      polyline.addTo(layerGroup);
    }

    // 2. Draw Stop markers with pulsating radar beacons
    const bounds = L.latLngBounds([]);

    stops.forEach(stop => {
      const { lat, lng } = stop.location;
      if (!lat || !lng) return;

      bounds.extend([lat, lng]);

      const isSelected = stop.id === selectedStopId;
      const icon = createCustomMarkerIcon(stop.type, isSelected);
      const marker = L.marker([lat, lng], { icon });

      markersRef.current.set(stop.id, marker);

      // Format ISO times
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

    // Auto-fit map to route bounds
    if (allCoordinates && allCoordinates.length > 0) {
      allCoordinates.forEach(c => bounds.extend(c));
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

    // Refresh map geometry to prevent rendering artifacts
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [stops, routeLegs, allCoordinates, selectedStopId, onSelectStop]);

  // Derived telemetry metrics
  const calculatedDistance = totalDistance ?? stops.reduce((acc, s) => Math.max(acc, s.distance_from_start_miles || 0), 0);
  const calculatedDriveHours = drivingHours ?? (calculatedDistance / 60);
  const calculatedStopsCount = stops.length;

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl border border-[#242424] bg-[#000000] ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating HUD Telemetry Overlay (Top Left) */}
      <div className="absolute top-3 left-3 z-10 pointer-events-auto">
        <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">TOTAL HAUL</span>
              <span className="font-bold text-white">{calculatedDistance.toFixed(0)} mi</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">DRIVING</span>
              <span className="font-bold text-white">{calculatedDriveHours.toFixed(1)} hrs</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Fuel className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">STOPS</span>
              <span className="font-bold text-white">{calculatedStopsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Map Controls & Tile Switcher (Top Right) */}
      <div className="absolute top-3 right-3 z-10 pointer-events-auto flex items-center gap-2">
        {/* Fit Route Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFitRoute}
          className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-slate-200 hover:text-white hover:border-[#0016CB] shadow-xl cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          title="Fit route to screen"
        >
          <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Fit Route</span>
        </motion.button>

        {/* Map Style Toggle */}
        <div className="p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center space-x-1 text-xs font-mono">
          {(['dark', 'street', 'satellite'] as MapTileStyle[]).map(style => (
            <button
              key={style}
              type="button"
              onClick={() => handleSwitchStyle(style)}
              className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold transition-all cursor-pointer ${
                activeStyle === style
                  ? 'bg-[#0016CB] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Waypoint Quick Jump Carousel (Bottom Left) */}
      {stops.length > 0 && (
        <div className="absolute bottom-3 left-3 right-16 z-10 pointer-events-auto overflow-x-auto pb-1 flex items-center gap-1.5 font-mono text-[11px]">
          <span className="px-2 py-1 bg-black/80 backdrop-blur-md text-[10px] text-slate-400 font-bold uppercase rounded-md shrink-0">
            Jump to:
          </span>
          {stops.map((stop, idx) => {
            const isSelected = stop.id === selectedStopId;
            return (
              <motion.button
                key={stop.id}
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleJumpToStop(stop)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 shadow-md ${
                  isSelected
                    ? 'bg-[#0016CB] text-white font-bold ring-2 ring-white/50'
                    : 'bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:border-[#0016CB]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${getStopColorClass(stop.type)}`} />
                <span>
                  {idx + 1}. {stop.location.city || stop.location.name.split(',')[0]}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Map Legend (Bottom Right above zoom) */}
      <div className="absolute bottom-12 right-3 z-10 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-2.5 shadow-xl hidden sm:flex flex-col gap-1 text-[10px] font-mono">
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

function createCustomMarkerIcon(type: string, isSelected: boolean): L.DivIcon {
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
    : 'ring-2 ring-white/80 shadow-black/80';

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
