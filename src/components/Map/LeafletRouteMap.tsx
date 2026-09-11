import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Stop, RouteLeg } from '../../types/hos';

interface LeafletRouteMapProps {
  stops: Stop[];
  routeLegs: RouteLeg[];
  allCoordinates: [number, number][];
  className?: string;
  selectedStopId?: string | null;
  onSelectStop?: (stop: Stop) => void;
}

export const LeafletRouteMap: React.FC<LeafletRouteMapProps> = ({
  stops,
  routeLegs,
  allCoordinates,
  className = 'h-[500px] w-full',
  selectedStopId,
  onSelectStop
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [39.8283, -98.5795], // Center of US
        zoom: 4,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

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

  // Update layers when stops or routeLegs change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw route polylines
    if (routeLegs && routeLegs.length > 0) {
      routeLegs.forEach((leg, idx) => {
        const color = idx === 0 ? '#2563eb' : '#4f46e5'; // Blue for Leg 1, Indigo for Leg 2
        const polyline = L.polyline(leg.geometry, {
          color,
          weight: 5,
          opacity: 0.85,
          lineJoin: 'round'
        });

        polyline.bindTooltip(
          `Leg ${idx + 1}: ${leg.from.name} → ${leg.to.name}<br/><strong>${leg.distance_miles} mi (${leg.driving_hours}h driving)</strong>`,
          { sticky: true }
        );

        polyline.addTo(layerGroup);
      });
    } else if (allCoordinates && allCoordinates.length > 0) {
      const polyline = L.polyline(allCoordinates, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85
      });
      polyline.addTo(layerGroup);
    }

    // 2. Draw Stop markers
    const bounds = L.latLngBounds([]);

    stops.forEach(stop => {
      const { lat, lng } = stop.location;
      if (!lat || !lng) return;

      bounds.extend([lat, lng]);

      const icon = createCustomMarkerIcon(stop.type, stop.id === selectedStopId);
      const marker = L.marker([lat, lng], { icon });

      // Popup content
      const formatTime = (iso: string) => {
        try {
          const d = new Date(iso);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        } catch {
          return iso;
        }
      };

      const popupHtml = `
        <div class="p-1 font-sans text-slate-800 text-xs max-w-xs">
          <div class="flex items-center gap-1.5 font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
            <span class="inline-block w-2.5 h-2.5 rounded-full ${getStopColorClass(stop.type)}"></span>
            <span>${getStopTypeTitle(stop.type)}</span>
          </div>
          <p class="font-semibold text-slate-900 mb-1">${stop.location.name}</p>
          <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-600 mb-2">
            <div><span class="text-slate-400">Arrival:</span> ${formatTime(stop.arrival_time)}</div>
            <div><span class="text-slate-400">Depart:</span> ${formatTime(stop.departure_time)}</div>
            <div><span class="text-slate-400">Duration:</span> ${stop.duration_hours}h</div>
            <div><span class="text-slate-400">Trip Mile:</span> ${Math.round(stop.distance_from_start_miles)} mi</div>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded p-1.5 mb-1">
            <span class="font-medium text-slate-700">Reason:</span> ${stop.reason}
          </div>
          <div class="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded p-1">
            <strong>HOS Impact:</strong> ${stop.hos_impact}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { minWidth: 220 });

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
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }

    // Refresh map layout geometry to prevent grey tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [stops, routeLegs, allCoordinates, selectedStopId, onSelectStop]);

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-sm border border-slate-200 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {/* Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg shadow-md border border-slate-200 text-xs flex flex-wrap gap-3 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
          <span className="text-slate-700 font-medium">Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
          <span className="text-slate-700 font-medium">Pickup</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
          <span className="text-slate-700 font-medium">Dropoff</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span className="text-slate-700 font-medium">Fuel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
          <span className="text-slate-700 font-medium">30m Break</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-700 inline-block"></span>
          <span className="text-slate-700 font-medium">10h Sleeper</span>
        </div>
      </div>
    </div>
  );
};

function getStopColorClass(type: string): string {
  switch (type) {
    case 'CURRENT': return 'bg-blue-600';
    case 'PICKUP': return 'bg-emerald-600';
    case 'DROPOFF': return 'bg-rose-600';
    case 'FUEL': return 'bg-amber-500';
    case 'REST_BREAK': return 'bg-purple-600';
    case 'SLEEPER': return 'bg-indigo-700';
    default: return 'bg-slate-600';
  }
}

function getStopTypeTitle(type: string): string {
  switch (type) {
    case 'CURRENT': return 'Trip Origin';
    case 'PICKUP': return 'Pickup Location (1h)';
    case 'DROPOFF': return 'Dropoff Location (1h)';
    case 'FUEL': return 'Planned Fuel Stop (30m)';
    case 'REST_BREAK': return 'Mandatory 30-Min Rest Break';
    case 'SLEEPER': return '10-Hour Sleeper Berth Rest';
    default: return 'Scheduled Stop';
  }
}

function createCustomMarkerIcon(type: string, isSelected: boolean): L.DivIcon {
  let bgColor = '#2563eb';
  let letter = 'O';

  switch (type) {
    case 'CURRENT':
      bgColor = '#2563eb';
      letter = 'O';
      break;
    case 'PICKUP':
      bgColor = '#059669';
      letter = 'P';
      break;
    case 'DROPOFF':
      bgColor = '#dc2626';
      letter = 'D';
      break;
    case 'FUEL':
      bgColor = '#d97706';
      letter = 'F';
      break;
    case 'REST_BREAK':
      bgColor = '#9333ea';
      letter = 'B';
      break;
    case 'SLEEPER':
      bgColor = '#4338ca';
      letter = 'S';
      break;
  }

  const ringStyle = isSelected ? 'ring-4 ring-blue-400 scale-110' : 'ring-2 ring-white';

  const html = `
    <div style="background-color: ${bgColor};" class="w-7 h-7 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs ${ringStyle} transition-transform">
      ${letter}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}
