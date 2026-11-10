import React, { useState, useEffect, useRef } from 'react';
import { LocationPoint, TripPlanRequest } from '../../types/hos';
import {
  MapPin,
  Truck,
  Package,
  Flag,
  Sparkles,
  ChevronDown,
  Loader2,
  Sliders,
  CheckCircle2,
  FileText,
  ArrowRight,
  RotateCcw,
  Compass,
  UserCheck,
  Crosshair,
  ArrowLeftRight,
  X,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card3D } from '../UI/Card3D';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface TripPlannerFormProps {
  onPlanTrip: (request: TripPlanRequest) => void;
  isLoading: boolean;
  planningStep?: string;
}

interface PresetRoute {
  id: string;
  label: string;
  tag: string;
  origin: LocationPoint;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  cycleUsed: number;
}

// Geodesic distance helper in miles
function calcHaversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const PRESET_ROUTES: PresetRoute[] = [
  {
    id: 'chicago-dallas',
    label: 'US Cross-Country Haul (Chicago → Indy → Dallas)',
    tag: '1,080 mi • Multi-Day Sleep & Fuel',
    origin: {
      name: 'Chicago, IL',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      lat: 41.8781,
      lng: -87.6298
    },
    pickup: {
      name: 'Indianapolis, IN',
      city: 'Indianapolis',
      state: 'IN',
      country: 'USA',
      lat: 39.7684,
      lng: -86.1581
    },
    dropoff: {
      name: 'Dallas, TX',
      city: 'Dallas',
      state: 'TX',
      country: 'USA',
      lat: 32.7767,
      lng: -96.7970
    },
    cycleUsed: 42.5
  },
  {
    id: 'midwest-run',
    label: 'Regional Midwest Run (Chicago → Effingham → St. Louis)',
    tag: '300 mi • Same-Day Regional Haul',
    origin: {
      name: 'Chicago, IL',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      lat: 41.8781,
      lng: -87.6298
    },
    pickup: {
      name: 'Effingham, IL',
      city: 'Effingham',
      state: 'IL',
      country: 'USA',
      lat: 39.1200,
      lng: -88.5434
    },
    dropoff: {
      name: 'St. Louis, MO',
      city: 'St. Louis',
      state: 'MO',
      country: 'USA',
      lat: 38.6270,
      lng: -90.1994
    },
    cycleUsed: 18.0
  },
  {
    id: 'india-corridor',
    label: 'India Highway Corridor (Tadepalligudem → Hyderabad → Bengaluru)',
    tag: '580 mi • Coastal & Deccan Freight Corridor',
    origin: {
      name: 'Tadepalligudem, AP, India',
      city: 'Tadepalligudem',
      state: 'Andhra Pradesh',
      country: 'India',
      lat: 16.8052,
      lng: 81.5283
    },
    pickup: {
      name: 'Hyderabad, TS, India',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      lat: 17.3850,
      lng: 78.4867
    },
    dropoff: {
      name: 'Bengaluru, KA, India',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      lat: 12.9716,
      lng: 77.5946
    },
    cycleUsed: 16.5
  },
  {
    id: 'europe-corridor',
    label: 'Paris → Frankfurt → Berlin (EU)',
    tag: '650 mi • Trans-Europe Logistics',
    origin: {
      name: 'Paris, France',
      city: 'Paris',
      state: 'Île-de-France',
      country: 'France',
      lat: 48.8566,
      lng: 2.3522
    },
    pickup: {
      name: 'Frankfurt, Germany',
      city: 'Frankfurt',
      state: 'Hessen',
      country: 'Germany',
      lat: 50.1109,
      lng: 8.6821
    },
    dropoff: {
      name: 'Berlin, Germany',
      city: 'Berlin',
      state: 'Berlin',
      country: 'Germany',
      lat: 52.5200,
      lng: 13.4050
    },
    cycleUsed: 28.0
  },
  {
    id: 'uk-corridor',
    label: 'London → Birmingham → Manchester (UK)',
    tag: '210 mi • UK Highway Corridor',
    origin: {
      name: 'London, United Kingdom',
      city: 'London',
      state: 'England',
      country: 'United Kingdom',
      lat: 51.5074,
      lng: -0.1278
    },
    pickup: {
      name: 'Birmingham, United Kingdom',
      city: 'Birmingham',
      state: 'England',
      country: 'United Kingdom',
      lat: 52.4862,
      lng: -1.8904
    },
    dropoff: {
      name: 'Manchester, United Kingdom',
      city: 'Manchester',
      state: 'England',
      country: 'United Kingdom',
      lat: 53.4808,
      lng: -2.2426
    },
    cycleUsed: 18.5
  },
  {
    id: 'canada-corridor',
    label: 'Toronto → Ottawa → Montreal (CA)',
    tag: '340 mi • Trans-Canada Freight',
    origin: {
      name: 'Toronto, ON',
      city: 'Toronto',
      state: 'ON',
      country: 'Canada',
      lat: 43.6532,
      lng: -79.3832
    },
    pickup: {
      name: 'Ottawa, ON',
      city: 'Ottawa',
      state: 'ON',
      country: 'Canada',
      lat: 45.4215,
      lng: -75.6972
    },
    dropoff: {
      name: 'Montreal, QC',
      city: 'Montreal',
      state: 'QC',
      country: 'Canada',
      lat: 45.5017,
      lng: -73.5673
    },
    cycleUsed: 24.0
  },
  {
    id: 'australia-corridor',
    label: 'Sydney → Canberra → Melbourne (AU)',
    tag: '540 mi • Hume Highway Corridor',
    origin: {
      name: 'Sydney, Australia',
      city: 'Sydney',
      state: 'NSW',
      country: 'Australia',
      lat: -33.8688,
      lng: 151.2093
    },
    pickup: {
      name: 'Canberra, Australia',
      city: 'Canberra',
      state: 'ACT',
      country: 'Australia',
      lat: -35.2809,
      lng: 149.1300
    },
    dropoff: {
      name: 'Melbourne, Australia',
      city: 'Melbourne',
      state: 'VIC',
      country: 'Australia',
      lat: -37.8136,
      lng: 144.9631
    },
    cycleUsed: 35.0
  },
  {
    id: 'asia-corridor',
    label: 'Tokyo → Nagoya → Osaka (JP)',
    tag: '320 mi • Tomei Expressway',
    origin: {
      name: 'Tokyo, Japan',
      city: 'Tokyo',
      state: 'Kanto',
      country: 'Japan',
      lat: 35.6762,
      lng: 139.6503
    },
    pickup: {
      name: 'Nagoya, Japan',
      city: 'Nagoya',
      state: 'Aichi',
      country: 'Japan',
      lat: 35.1815,
      lng: 136.9066
    },
    dropoff: {
      name: 'Osaka, Japan',
      city: 'Osaka',
      state: 'Kansai',
      country: 'Japan',
      lat: 34.6937,
      lng: 135.5023
    },
    cycleUsed: 20.0
  },
  {
    id: 'atlanta-jacksonville',
    label: 'Atlanta → Charlotte → Jax (USA)',
    tag: '720 mi • 30m Break Required',
    origin: {
      name: 'Atlanta, GA',
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      lat: 33.7490,
      lng: -84.3880
    },
    pickup: {
      name: 'Charlotte, NC',
      city: 'Charlotte',
      state: 'NC',
      country: 'USA',
      lat: 35.2271,
      lng: -80.8431
    },
    dropoff: {
      name: 'Jacksonville, FL',
      city: 'Jacksonville',
      state: 'FL',
      country: 'USA',
      lat: 30.3322,
      lng: -81.6557
    },
    cycleUsed: 31.0
  },
  {
    id: 'la-saltlake',
    label: 'LA → Vegas → Salt Lake City (USA)',
    tag: '750 mi • Mountain Highway Corridor',
    origin: {
      name: 'Los Angeles, CA',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      lat: 34.0522,
      lng: -118.2437
    },
    pickup: {
      name: 'Las Vegas, NV',
      city: 'Las Vegas',
      state: 'NV',
      country: 'USA',
      lat: 36.1699,
      lng: -115.1398
    },
    dropoff: {
      name: 'Salt Lake City, UT',
      city: 'Salt Lake City',
      state: 'UT',
      country: 'USA',
      lat: 40.7608,
      lng: -111.8910
    },
    cycleUsed: 22.0
  }
];

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  onPlanTrip,
  isLoading,
  planningStep
}) => {
  const { user, isAuthenticated } = useAuth();
  const { info: toastInfo, success: toastSuccess, error: toastError, removeToast } = useToast();

  const [telemetryStageIdx, setTelemetryStageIdx] = useState(0);
  const TELEMETRY_STAGES = [
    'Acquiring Waypoints...',
    'Computing OSRM Highway Geometry...',
    'Applying FMCSA 11/14/30/70h Rules...',
    'Rendering 24.00h ELD Rods...'
  ];

  useEffect(() => {
    if (!isLoading) {
      setTelemetryStageIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setTelemetryStageIdx(prev => (prev + 1) % TELEMETRY_STAGES.length);
    }, 650);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Location States
  const [currentLoc, setCurrentLoc] = useState<LocationPoint>(PRESET_ROUTES[0].origin);
  const [pickupLoc, setPickupLoc] = useState<LocationPoint>(PRESET_ROUTES[0].pickup);
  const [dropoffLoc, setDropoffLoc] = useState<LocationPoint>(PRESET_ROUTES[0].dropoff);
  const [currentCycleUsed, setCurrentCycleUsed] = useState<number>(42.5);
  const [activePresetId, setActivePresetId] = useState<string>('chicago-dallas');
  const [isLocatingField, setIsLocatingField] = useState<string | null>(null);
  const [swapRotation, setSwapRotation] = useState<number>(0);

  // Optional Shipping info
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const [carrierName, setCarrierName] = useState("John Doe's Transportation");
  const [carrierOffice, setCarrierOffice] = useState('Washington, D.C.');
  const [driverName, setDriverName] = useState('John E. Doe');
  const [truckNumber, setTruckNumber] = useState('123');
  const [trailerNumber, setTrailerNumber] = useState('20544');
  const [shippingDocNumber, setShippingDocNumber] = useState('101601');
  const [commodity, setCommodity] = useState('General Commercial Freight');

  // Auto-sync authenticated driver details
  useEffect(() => {
    if (user) {
      setDriverName(user.name || '');
      setCarrierName(user.carrier_name || '');
      setCarrierOffice(user.carrier_office || '');
      setTruckNumber(user.truck_number || '');
      setTrailerNumber(user.trailer_number || '');
      if (user.current_cycle_used != null && !isNaN(user.current_cycle_used)) {
        setCurrentCycleUsed(user.current_cycle_used);
      }
    }
  }, [user]);

  const handleApplyPreset = (preset: PresetRoute) => {
    setActivePresetId(preset.id);
    setCurrentLoc(preset.origin);
    setPickupLoc(preset.pickup);
    setDropoffLoc(preset.dropoff);
    setCurrentCycleUsed(preset.cycleUsed);
    toastInfo(
      `Corridor Loaded: ${preset.label}`,
      `Origin: ${preset.origin.name} → Pickup: ${preset.pickup.name} → Dropoff: ${preset.dropoff.name} (${preset.cycleUsed}h cycle hours)`
    );
  };

  const handleResetForm = () => {
    handleApplyPreset(PRESET_ROUTES[0]);
    toastInfo('Route Parameters Reset', 'Corridor inputs restored to default Chicago → Dallas corridor.');
  };

  // Zero-Failure Multi-Stage Geolocation Pipeline (GPS ➔ IP Fallback ➔ Nominatim)
  const handleAcquireCurrentLocation = (target: 'origin' | 'pickup' | 'dropoff' = 'origin') => {
    setIsLocatingField(target);
    const toastId = toastInfo('Detecting Location', 'Acquiring GPS coordinates from your device...');

    const applyLocation = (loc: LocationPoint, source: string) => {
      removeToast(toastId);
      if (target === 'origin') setCurrentLoc(loc);
      else if (target === 'pickup') setPickupLoc(loc);
      else if (target === 'dropoff') setDropoffLoc(loc);

      setActivePresetId('');
      toastSuccess(
        `Location Locked: ${loc.city || loc.name.split(',')[0]}`,
        `Set ${target.toUpperCase()} to ${loc.name} via ${source}`
      );
      setIsLocatingField(null);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('hos-fly-to-location', { detail: { lat: loc.lat, lng: loc.lng } }));
      }
    };

    // Stage 2 & 3: High-reliability IP Geolocation Fallback
    const tryIpGeolocation = async () => {
      // 1. Primary: ipwho.is (fast, HTTPS, CORS-friendly, global)
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success !== false && data.latitude && data.longitude) {
            const city = data.city || '';
            const region = data.region_code || data.region || '';
            const country = data.country || data.country_code || '';
            const nameParts = [city, region, country].filter(Boolean);
            const displayName = nameParts.length > 0 ? nameParts.join(', ') : `${data.city || 'Regional Center'}, ${data.country || 'Global'}`;

            const loc: LocationPoint = {
              name: displayName,
              city: city || 'Local Terminal',
              state: region,
              country: country || 'Global',
              lat: Number(data.latitude),
              lng: Number(data.longitude),
              address: `${displayName} (IP Telematics)`
            };
            applyLocation(loc, 'Network Telematics');
            return;
          }
        }
      } catch (e1) {
        console.warn('ipwho.is fallback failed, trying geojs:', e1);
      }

      // 2. Secondary: get.geojs.io
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            const city = data.city || '';
            const region = data.region || '';
            const country = data.country || data.country_code || '';
            const nameParts = [city, region, country].filter(Boolean);
            const displayName = nameParts.length > 0 ? nameParts.join(', ') : 'Regional Freight Terminal';

            const loc: LocationPoint = {
              name: displayName,
              city: city || 'Regional Center',
              state: region,
              country: country || 'Global',
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude),
              address: `${displayName} (GeoJS Telematics)`
            };
            applyLocation(loc, 'Network Telematics');
            return;
          }
        }
      } catch (e2) {
        console.warn('geojs fallback failed, trying ipapi:', e2);
      }

      // 3. Tertiary: ipapi.co
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            const city = data.city || '';
            const region = data.region_code || data.region || '';
            const country = data.country_name || data.country || '';
            const nameParts = [city, region, country].filter(Boolean);
            const displayName = nameParts.length > 0 ? nameParts.join(', ') : 'Commercial Terminal';

            const loc: LocationPoint = {
              name: displayName,
              city: city || 'Commercial Hub',
              state: region,
              country: country || 'Global',
              lat: Number(data.latitude),
              lng: Number(data.longitude),
              address: `${displayName} (IP-API)`
            };
            applyLocation(loc, 'Network Telematics');
            return;
          }
        }
      } catch (e3) {
        console.warn('All IP geolocation endpoints exhausted:', e3);
      }

      // Safe resilient default hub fallback (e.g. Chicago Terminal #04)
      const defaultHub = PRESET_ROUTES[0].origin;
      applyLocation(defaultHub, 'Default Regional Hub');
    };

    // Stage 1: Try Browser GPS with 5000ms timeout
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Attempt OSM Nominatim Reverse Geocode
          try {
            const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
              headers: { 'User-Agent': 'HOSRoutePlannerELD/1.0' }
            });
            if (nomRes.ok) {
              const nomData = await nomRes.json();
              const addr = nomData.address || {};
              const city = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || '';
              const state = addr.state || addr.region || '';
              const country = addr.country || '';
              const nameParts = [city, state, country].filter(Boolean);
              const displayName = nameParts.length > 0 ? nameParts.join(', ') : nomData.display_name?.split(',').slice(0, 3).join(', ');

              const loc: LocationPoint = {
                name: displayName || `GPS Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                city: city || 'Current Location',
                state,
                country: country || 'Global',
                lat,
                lng,
                address: nomData.display_name || `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`
              };
              applyLocation(loc, 'Precision GPS');
              return;
            }
          } catch (e) {
            console.warn('Nominatim reverse geocode error:', e);
          }

          // Photon reverse fallback
          try {
            const photonRes = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`);
            if (photonRes.ok) {
              const pData = await photonRes.json();
              if (pData?.features && pData.features.length > 0) {
                const props = pData.features[0]?.properties || {};
                const city = props.city || props.town || props.locality || '';
                const state = props.state || '';
                const country = props.country || '';
                const parts = [city, state, country].filter(Boolean);
                if (parts.length > 0) {
                  const loc: LocationPoint = {
                    name: parts.join(', '),
                    city: city || 'Local Area',
                    state,
                    country,
                    lat,
                    lng,
                    address: `${city ? city + ', ' : ''}${state ? state + ', ' : ''}${country}`
                  };
                  applyLocation(loc, 'Precision GPS');
                  return;
                }
              }
            }
          } catch (pe) {
            console.warn('Photon fallback error:', pe);
          }

          // Direct GPS Coordinate point
          const fallbackLoc: LocationPoint = {
            name: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            city: 'Current Location',
            state: '',
            country: 'Global',
            lat,
            lng,
            address: `GPS Pin: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
          };
          applyLocation(fallbackLoc, 'Precision GPS');
        },
        (_err) => {
          // CRITICAL: NEVER SHOW ERROR TOAST! Silently fall back to IP Geolocation
          console.info('Browser GPS unavailable/denied, activating silent IP fallback pipeline...');
          tryIpGeolocation();
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // Browser doesn't support geolocation, silent IP fallback
      tryIpGeolocation();
    }
  };

  // Swap Origin and Dropoff
  const handleSwapRoute = () => {
    setSwapRotation(prev => prev + 180);
    const temp = currentLoc;
    setCurrentLoc(dropoffLoc);
    setDropoffLoc(temp);
    setActivePresetId('');
    toastInfo('Route Inverted', `Swapped Origin (${dropoffLoc.name}) and Dropoff (${temp.name}).`);
  };

  // Swap Pickup and Dropoff
  const handleSwapPickupDropoff = () => {
    setSwapRotation(prev => prev + 180);
    const temp = pickupLoc;
    setPickupLoc(dropoffLoc);
    setDropoffLoc(temp);
    setActivePresetId('');
    toastInfo('Stops Swapped', `Swapped Pickup (${dropoffLoc.name}) and Dropoff (${temp.name}).`);
  };

  // Helper to ensure location has valid numeric coordinates
  const resolveLocationCoordinates = async (loc: LocationPoint): Promise<LocationPoint> => {
    if (loc.lat && loc.lng && (loc.lat !== 0 || loc.lng !== 0)) {
      return loc;
    }
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: loc.name })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results[0];
        }
      }
    } catch (err) {
      console.error('Failed to geocode location:', err);
    }
    return loc;
  };

  const distCurrentToPickup = calcHaversineMiles(
    currentLoc.lat, currentLoc.lng,
    pickupLoc.lat, pickupLoc.lng
  );
  const distPickupToDropoff = calcHaversineMiles(
    pickupLoc.lat, pickupLoc.lng,
    dropoffLoc.lat, dropoffLoc.lng
  );
  const isOceanCrossing = distCurrentToPickup > 3500 || distPickupToDropoff > 3500;
  const isOriginInIndia =
    currentLoc.country === 'India' ||
    (currentLoc.lat >= 6.5 && currentLoc.lat <= 37.5 && currentLoc.lng >= 68.0 && currentLoc.lng <= 97.5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOceanCrossing) {
      toastError(
        'Ocean Crossing Cannot Be Planned',
        'Commercial trucks require connected road networks. Click "Plan India Corridor" or "Test US Corridor" below.'
      );
      return;
    }

    // Verify and ensure all 3 locations have valid coordinates
    const resolvedOrigin = await resolveLocationCoordinates(currentLoc);
    const resolvedPickup = await resolveLocationCoordinates(pickupLoc);
    const resolvedDropoff = await resolveLocationCoordinates(dropoffLoc);

    onPlanTrip({
      current_location: resolvedOrigin,
      pickup_location: resolvedPickup,
      dropoff_location: resolvedDropoff,
      current_cycle_used: Number(currentCycleUsed),
      carrier_name: carrierName,
      carrier_office: carrierOffice,
      driver_name: driverName,
      truck_number: truckNumber,
      trailer_number: trailerNumber,
      shipping_doc_number: shippingDocNumber,
      commodity
    });
  };

  return (
    <Card3D depth={6} className="w-full">
      <form
        onSubmit={handleSubmit}
        className="uc-glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden preserve-3d"
      >
        {/* Logged in Driver Sync Banner */}
        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex flex-wrap items-center justify-between gap-2.5 text-xs text-blue-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-white">Active Driver: </span>
                <span>{user.name} ({user.carrier_name})</span>
                {user.cdl_number && (
                  <span className="font-mono text-[11px] text-blue-300 ml-1.5">
                    [{user.cdl_number}]
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 font-mono">
                ELD AUTO-POPULATED
              </span>
            </div>
          </motion.div>
        )}

        {/* Top Banner with Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2.5 font-display">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Truck className="w-4 h-4" />
              </div>
              <span>Trip Route &amp; Cycle Configuration</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select origin, pickup, dropoff locations, or pick a rapid-test corridor below:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, rotate: -45 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetForm}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
              title="Reset to default route"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Quick Corridor Presets Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Commercial Corridor Presets:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_ROUTES.map(preset => {
              const isSelected = activePresetId === preset.id;
              return (
                <motion.button
                  key={preset.id}
                  type="button"
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-400 shadow-[0_0_25px_rgba(0,22,203,0.5)] ring-2 ring-blue-400/50'
                      : 'bg-black/40 hover:bg-white/[0.08] backdrop-blur-md border-white/10 hover:border-blue-500/60 text-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{preset.label}</span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-pulse" />}
                  </div>
                  <div
                    className={`text-[10px] mt-1 font-mono ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {preset.tag}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick Route Actions Toolbar: GPS, Swap, Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 p-2.5 rounded-xl bg-black/35 backdrop-blur-md border border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct GPS Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAcquireCurrentLocation('origin')}
              disabled={isLocatingField === 'origin'}
              className="btn-electric-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-[0_0_15px_rgba(0,22,203,0.4)] hover:shadow-[0_0_25px_rgba(0,22,203,0.7)]"
              title="Detect your device GPS location and set as origin"
            >
              {isLocatingField === 'origin' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Crosshair className="w-3.5 h-3.5" />
              )}
              <span>Use My Current Location</span>
            </motion.button>

            {/* Invert / Swap Route Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSwapRoute}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/15 text-slate-200 border border-white/10 hover:border-blue-400/50 hover:shadow-[0_0_18px_rgba(56,189,248,0.35)] text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all font-mono backdrop-blur-sm"
              title="Reverse route direction (Swap Origin and Dropoff)"
            >
              <motion.div animate={{ rotate: swapRotation }} transition={{ duration: 0.35, ease: 'easeInOut' }}>
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
              </motion.div>
              <span>Swap Origin ⇄ Dropoff</span>
            </motion.button>

            {/* Swap Pickup and Dropoff */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSwapPickupDropoff}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/15 text-slate-200 border border-white/10 hover:border-emerald-400/50 hover:shadow-[0_0_18px_rgba(16,185,129,0.35)] text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all font-mono backdrop-blur-sm"
              title="Swap Pickup and Dropoff locations"
            >
              <motion.div animate={{ rotate: swapRotation }} transition={{ duration: 0.35, ease: 'easeInOut' }}>
                <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              </motion.div>
              <span>Swap Pickup ⇄ Dropoff</span>
            </motion.button>

            {/* Reset / Clear Form */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleResetForm}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 hover:border-rose-400/40 hover:shadow-[0_0_18px_rgba(244,63,94,0.35)] text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all font-mono backdrop-blur-sm group"
              title="Reset all form fields to default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-[-360deg] transition-transform duration-500" />
              <span>Reset Form</span>
            </motion.button>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>Global routing across all countries</span>
          </div>
        </div>

        {/* 3 Location Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Current Location */}
          <LocationAutocompleteInput
            id="origin-input"
            label="Current Location (Origin)"
            icon={<Truck className="w-4 h-4 text-blue-600" />}
            value={currentLoc}
            onChange={loc => {
              setCurrentLoc(loc);
              setActivePresetId('');
            }}
            placeholder="Type city, state, or country..."
            onLocateMe={() => handleAcquireCurrentLocation('origin')}
            isLocating={isLocatingField === 'origin'}
          />

          {/* Pickup Location */}
          <LocationAutocompleteInput
            id="pickup-input"
            label="Pickup Location (1h Stop)"
            icon={<Package className="w-4 h-4 text-emerald-600" />}
            value={pickupLoc}
            onChange={loc => {
              setPickupLoc(loc);
              setActivePresetId('');
            }}
            placeholder="Type city, state, or country..."
            onLocateMe={() => handleAcquireCurrentLocation('pickup')}
            isLocating={isLocatingField === 'pickup'}
          />

          {/* Dropoff Location */}
          <LocationAutocompleteInput
            id="dropoff-input"
            label="Dropoff Location (1h Stop)"
            icon={<Flag className="w-4 h-4 text-rose-600" />}
            value={dropoffLoc}
            onChange={loc => {
              setDropoffLoc(loc);
              setActivePresetId('');
            }}
            placeholder="Type city, state, or country..."
            onLocateMe={() => handleAcquireCurrentLocation('dropoff')}
            isLocating={isLocatingField === 'dropoff'}
          />
        </div>

        {/* Ocean Crossing / Regional Alignment Guidance Banner */}
        {isOceanCrossing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="font-bold text-sm flex items-center justify-between">
                  <span>
                    {isOriginInIndia
                      ? `Origin in India (${currentLoc.city || 'Tadepalligudem'}) & US Destination Detected`
                      : 'Ocean Crossing Detected Between Route Stops'}
                  </span>
                  <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                    ~{Math.round(distCurrentToPickup).toLocaleString()} mi apart
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-300 leading-relaxed">
                  Commercial trucks require a continuous highway corridor. Origin and destination cannot cross open oceans. Choose one of the quick 1-click solutions below to plan a compliant route immediately:
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPickupLoc({
                        name: 'Hyderabad, TS, India',
                        city: 'Hyderabad',
                        state: 'Telangana',
                        country: 'India',
                        lat: 17.3850,
                        lng: 78.4867
                      });
                      setDropoffLoc({
                        name: 'Bengaluru, KA, India',
                        city: 'Bengaluru',
                        state: 'Karnataka',
                        country: 'India',
                        lat: 12.9716,
                        lng: 77.5946
                      });
                      setCurrentCycleUsed(16.5);
                      setActivePresetId('india-corridor');
                      toastSuccess('India Freight Corridor Set!', 'Stops connected from your current location to Hyderabad and Bengaluru.');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>🇮🇳 Plan India Corridor (Hyderabad → Bengaluru)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleApplyPreset(PRESET_ROUTES[0]);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>🇺🇸 Test US Corridor (Chicago → Indianapolis → Dallas)</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 70/8 Cycle Usage Input with Dynamic Visual Bar & Quick Chips */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-5 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 font-mono">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Current 70-Hour / 8-Day Cycle Used:</span>
            </label>
            <motion.div
              key={currentCycleUsed}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 font-mono text-sm font-black text-cyan-300 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 shadow-xs"
            >
              <span>{(currentCycleUsed ?? 0).toFixed(1)}</span>
              <span className="text-slate-400 font-normal text-xs">/ 70.0 hrs</span>
            </motion.div>
          </div>

          <div className="space-y-2 mb-3">
            <input
              type="range"
              min="0"
              max="69"
              step="0.5"
              value={currentCycleUsed ?? 0}
              onChange={e => setCurrentCycleUsed(parseFloat(e.target.value) || 0)}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0052FF]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0.0 hrs (Fresh cycle)</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-ping" />
                <span>{(70 - (currentCycleUsed ?? 0)).toFixed(1)} hrs available</span>
              </span>
              <span>69.0 hrs (Near limit)</span>
            </div>
          </div>

          {/* Quick Select Cycle Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 font-mono">
              Quick Presets:
            </span>
            {[
              { label: '0.0h Fresh Restart', val: 0 },
              { label: '20.0h Light Duty', val: 20 },
              { label: '42.5h Mid-Week', val: 42.5 },
              { label: '62.0h Near Max', val: 62 }
            ].map(chip => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setCurrentCycleUsed(chip.val);
                  toastInfo('Cycle Hours Updated', `Set 70-hour cycle used to ${chip.val} hrs.`);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                  Math.abs((currentCycleUsed ?? 0) - chip.val) < 0.2
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carrier & Shipping Details Accordion */}
        <div className="mb-6 border border-slate-800 rounded-2xl overflow-hidden shadow-xs bg-slate-900/60">
          <motion.button
            type="button"
            onClick={() => setShowShippingDetails(!showShippingDetails)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-900/90 text-left text-xs font-bold text-slate-200 transition-colors cursor-pointer hover:bg-slate-850"
          >
            <div className="flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Carrier, Driver &amp; Shipping Manifest Details (Optional)</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                showShippingDetails ? 'rotate-180 text-blue-400' : ''
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {showShippingDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="p-5 bg-[#080D1A] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs border-t border-slate-800 font-mono">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Carrier Name:</label>
                    <input
                      type="text"
                      value={carrierName}
                      onChange={e => setCarrierName(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Carrier Office Address:</label>
                    <input
                      type="text"
                      value={carrierOffice}
                      onChange={e => setCarrierOffice(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Driver Name / Signature:</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={e => setDriverName(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Tractor / Truck #:</label>
                    <input
                      type="text"
                      value={truckNumber}
                      onChange={e => setTruckNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Trailer #:</label>
                    <input
                      type="text"
                      value={trailerNumber}
                      onChange={e => setTrailerNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Shipping Doc / DVL #:</label>
                    <input
                      type="text"
                      value={shippingDocNumber}
                      onChange={e => setShippingDocNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="font-semibold text-slate-300 block mb-1">Commodity:</label>
                    <input
                      type="text"
                      value={commodity}
                      onChange={e => setCommodity(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary Submit Button with 3D Pop & Shimmer */}
        <div className="space-y-3">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="btn-uc-solid w-full py-4 px-6 text-sm sm:text-base font-bold tracking-wider flex items-center justify-center space-x-2.5 cursor-pointer shadow-[0_0_30px_rgba(0,22,203,0.45)] font-mono"
          >
            {/* Animated Light Shimmer Beam */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <motion.span
                  key={telemetryStageIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold tracking-wider"
                >
                  {planningStep || TELEMETRY_STAGES[telemetryStageIdx]}
                </motion.span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 transition-transform group-hover:scale-125 text-emerald-400" />
                <span className="font-bold tracking-wider">PLAN COMPLIANT TRIP</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1.5 transition-transform" />
              </>
            )}
          </motion.button>

          {/* Live Step Progress Indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-2xl text-xs text-blue-300 flex items-center gap-3 shadow-sm font-mono"
              >
                <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
                <span className="font-bold">{planningStep || 'Analyzing highway network & calculating HOS rules...'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Card3D>
  );
};

interface LocationInputProps {
  id?: string;
  label: string;
  icon: React.ReactNode;
  value: LocationPoint;
  onChange: (loc: LocationPoint) => void;
  placeholder: string;
  onLocateMe?: () => void;
  isLocating?: boolean;
}

const LocationAutocompleteInput: React.FC<LocationInputProps> = ({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder,
  onLocateMe,
  isLocating
}) => {
  const [query, setQuery] = useState(value.name || '');
  const [suggestions, setSuggestions] = useState<LocationPoint[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value.name || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch('/api/geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() })
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
        }
      } catch (err) {
        console.error('Geocode search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (loc: LocationPoint) => {
    onChange(loc);
    setQuery(loc.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    onChange({ name: '', city: '', state: '', country: '', lat: 0, lng: 0 });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </label>
        {onLocateMe && (
          <button
            type="button"
            onClick={onLocateMe}
            disabled={isLocating}
            className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
            title="Locate with device GPS"
          >
            {isLocating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Crosshair className="w-3 h-3" />
            )}
            <span>GPS</span>
          </button>
        )}
      </div>

      <div className="relative group">
        <input
          id={id}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (value.name !== e.target.value) {
              onChange({
                name: e.target.value,
                city: e.target.value,
                state: '',
                country: '',
                lat: 0,
                lng: 0
              });
            }
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Enter' && suggestions.length > 0) {
              e.preventDefault();
              handleSelect(suggestions[0]);
            }
          }}
          placeholder={placeholder}
          className="w-full p-3.5 pl-9 pr-16 text-xs font-bold text-white bg-black/40 backdrop-blur-md border border-white/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 shadow-inner group-hover:border-white/30 transition-colors font-sans placeholder-slate-400"
        />
        <div className="absolute left-3 top-4 text-slate-400 pointer-events-none transition-colors group-hover:text-blue-400">
          <MapPin className="w-4 h-4" />
        </div>

        {/* Action icons on right: clear & GPS */}
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isSearching ? (
            <div className="p-1 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
          ) : onLocateMe ? (
            <button
              type="button"
              onClick={onLocateMe}
              disabled={isLocating}
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Acquire current GPS position"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#0B0F19]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto"
          >
            {suggestions.map((sug, i) => (
              <motion.button
                key={`sug-${i}`}
                type="button"
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSelect(sug)}
                className="w-full px-3.5 py-2.5 text-left border-b border-slate-100 dark:border-slate-800 last:border-none flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{sug.name}</span>
                    {sug.country && (
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ml-2 shrink-0">
                        {sug.country}
                      </span>
                    )}
                  </div>
                  {sug.address && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full">
                      {sug.address}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
