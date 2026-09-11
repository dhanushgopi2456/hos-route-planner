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
  Navigation,
  ArrowRight,
  RotateCcw,
  Compass,
  UserCheck,
  ShieldCheck,
  Crosshair,
  ArrowLeftRight,
  X,
  Globe
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

const PRESET_ROUTES: PresetRoute[] = [
  {
    id: 'chicago-dallas',
    label: 'Chicago → Indy → Dallas (USA)',
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
  const { info: toastInfo, success: toastSuccess, error: toastError } = useToast();

  // Location States
  const [currentLoc, setCurrentLoc] = useState<LocationPoint>(PRESET_ROUTES[0].origin);
  const [pickupLoc, setPickupLoc] = useState<LocationPoint>(PRESET_ROUTES[0].pickup);
  const [dropoffLoc, setDropoffLoc] = useState<LocationPoint>(PRESET_ROUTES[0].dropoff);
  const [currentCycleUsed, setCurrentCycleUsed] = useState<number>(42.5);
  const [activePresetId, setActivePresetId] = useState<string>('chicago-dallas');
  const [isLocatingField, setIsLocatingField] = useState<string | null>(null);

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

  // Acquire Current Location using GPS & Reverse Geocoding
  const handleAcquireCurrentLocation = (target: 'origin' | 'pickup' | 'dropoff' = 'origin') => {
    if (!navigator.geolocation) {
      toastError('Geolocation Unsupported', 'Your browser or device does not support GPS geolocation.');
      return;
    }

    setIsLocatingField(target);
    toastInfo('Detecting Location', 'Acquiring GPS coordinates from your device...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : null;

        try {
          const res = await fetch('/api/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.location) {
              const loc: LocationPoint = data.location;
              if (target === 'origin') setCurrentLoc(loc);
              else if (target === 'pickup') setPickupLoc(loc);
              else if (target === 'dropoff') setDropoffLoc(loc);

              setActivePresetId('');
              toastSuccess(
                'Current Location Detected!',
                `Set ${target.toUpperCase()} to ${loc.name} (${lat.toFixed(4)}, ${lng.toFixed(4)}${accuracy ? ` ±${accuracy}m` : ''})`
              );
              setIsLocatingField(null);
              return;
            }
          }
        } catch (e) {
          console.warn('Reverse geocode fallback:', e);
        }

        // Fallback with GPS Pin
        const fallbackLoc: LocationPoint = {
          name: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          city: 'Current Location',
          state: '',
          country: 'Global',
          lat,
          lng,
          address: `GPS Pin: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
        };

        if (target === 'origin') setCurrentLoc(fallbackLoc);
        else if (target === 'pickup') setPickupLoc(fallbackLoc);
        else if (target === 'dropoff') setDropoffLoc(fallbackLoc);

        setActivePresetId('');
        toastSuccess('GPS Location Acquired!', `Coordinates set to ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setIsLocatingField(null);
      },
      (err) => {
        setIsLocatingField(null);
        let msg = 'Could not acquire your device location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser settings.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        toastError('Location Error', msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  // Swap Origin and Dropoff
  const handleSwapRoute = () => {
    const temp = currentLoc;
    setCurrentLoc(dropoffLoc);
    setDropoffLoc(temp);
    setActivePresetId('');
    toastInfo('Route Inverted', `Swapped Origin (${dropoffLoc.name}) and Dropoff (${temp.name}).`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        className="glass-panel-3d dark:bg-slate-900/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden preserve-3d"
      >
        {/* Logged in Driver Sync Banner */}
        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-2.5 text-xs text-blue-950 dark:text-blue-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold">Active Driver: </span>
                <span>{user.name} ({user.carrier_name})</span>
                {user.cdl_number && (
                  <span className="font-mono text-[11px] text-blue-700 dark:text-blue-300 ml-1.5">
                    [{user.cdl_number}]
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/40">
                ELD Auto-Populated
              </span>
            </div>
          </motion.div>
        )}

        {/* Top Banner with Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Truck className="w-4 h-4" />
              </div>
              <span>Trip Route &amp; Cycle Configuration</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select origin, pickup, dropoff locations, or pick a rapid-test corridor below:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, rotate: -45 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetForm}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Reset to default route"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Quick Corridor Presets Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Tested Route Corridors (Click to load):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_ROUTES.map(preset => {
              const isSelected = activePresetId === preset.id;
              return (
                <motion.button
                  key={preset.id}
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                      : 'bg-white/90 dark:bg-slate-800/80 hover:bg-blue-50/70 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{preset.label}</span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-spin" />}
                  </div>
                  <div
                    className={`text-[10px] mt-1 font-mono ${
                      isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
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
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct GPS Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAcquireCurrentLocation('origin')}
              disabled={isLocatingField === 'origin'}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSwapRoute}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reverse route direction (Swap Origin and Dropoff)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Swap Origin ⇄ Dropoff</span>
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

        {/* 70/8 Cycle Usage Input with Dynamic Visual Bar & Quick Chips */}
        <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-indigo-50/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border border-slate-200/90 dark:border-slate-700 rounded-2xl p-4 mb-5 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Current 70-Hour / 8-Day Cycle Used:</span>
            </label>
            <motion.div
              key={currentCycleUsed}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 font-mono text-sm font-black text-blue-900 dark:text-blue-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-300/80 dark:border-slate-700 shadow-xs"
            >
              <span>{(currentCycleUsed ?? 0).toFixed(1)}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">/ 70.0 hrs</span>
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
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>0.0 hrs (Fresh cycle)</span>
              <span className="text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-ping"></span>
                <span>{(70 - (currentCycleUsed ?? 0)).toFixed(1)} hrs available</span>
              </span>
              <span>69.0 hrs (Near limit)</span>
            </div>
          </div>

          {/* Quick Select Cycle Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
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
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carrier & Shipping Details Accordion */}
        <div className="mb-6 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs bg-white/70 dark:bg-slate-800/60">
          <motion.button
            type="button"
            whileHover={{ backgroundColor: '#f8fafc' }}
            onClick={() => setShowShippingDetails(!showShippingDetails)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/90 text-left text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Carrier, Driver &amp; Shipping Manifest Details (Optional)</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                showShippingDetails ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
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
                <div className="p-5 bg-white dark:bg-slate-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Carrier Name:</label>
                    <input
                      type="text"
                      value={carrierName}
                      onChange={e => setCarrierName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Carrier Office Address:</label>
                    <input
                      type="text"
                      value={carrierOffice}
                      onChange={e => setCarrierOffice(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Driver Name / Signature:</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={e => setDriverName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Tractor / Truck #:</label>
                    <input
                      type="text"
                      value={truckNumber}
                      onChange={e => setTruckNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Trailer #:</label>
                    <input
                      type="text"
                      value={trailerNumber}
                      onChange={e => setTrailerNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Shipping Doc / DVL #:</label>
                    <input
                      type="text"
                      value={shippingDocNumber}
                      onChange={e => setShippingDocNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Commodity:</label>
                    <input
                      type="text"
                      value={commodity}
                      onChange={e => setCommodity(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
            whileHover={{ scale: 1.02, y: -2, boxShadow: '0 15px 35px -5px rgba(59, 130, 246, 0.45)' }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 active:from-blue-700 disabled:opacity-60 text-white font-black text-sm tracking-wider shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2.5 transition-all cursor-pointer overflow-hidden border border-white/20"
          >
            {/* Animated Light Shimmer Beam */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating FMCSA Compliant Route &amp; ELD Logs...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 transition-transform group-hover:scale-125" />
                <span>PLAN COMPLIANT TRIP</span>
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
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center gap-3 shadow-sm"
              >
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
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
  label: string;
  icon: React.ReactNode;
  value: LocationPoint;
  onChange: (loc: LocationPoint) => void;
  placeholder: string;
  onLocateMe?: () => void;
  isLocating?: boolean;
}

const LocationAutocompleteInput: React.FC<LocationInputProps> = ({
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
          className="w-full p-3 pl-9 pr-16 text-xs font-bold text-slate-900 dark:text-white bg-white/95 dark:bg-slate-800/95 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs group-hover:border-slate-400 dark:group-hover:border-slate-600 transition-colors"
        />
        <div className="absolute left-3 top-3.5 text-slate-400 pointer-events-none transition-colors group-hover:text-blue-500">
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
            className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto"
          >
            {suggestions.map((sug, i) => (
              <motion.button
                key={`sug-${i}`}
                type="button"
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSelect(sug)}
                className="w-full px-3.5 py-2.5 text-left border-b border-slate-100 dark:border-slate-800 last:border-none flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
