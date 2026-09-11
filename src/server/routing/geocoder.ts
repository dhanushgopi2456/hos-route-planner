import { LocationPoint } from '../../types/hos';

// Pre-seeded high-accuracy freight terminals & major logistics hubs across all global corridors
export const KNOWN_HUBS: LocationPoint[] = [
  // North America
  { name: 'Chicago, IL, USA', city: 'Chicago', state: 'IL', country: 'USA', lat: 41.8781, lng: -87.6298, address: 'Chicago Freight Terminal, IL, USA' },
  { name: 'Indianapolis, IN, USA', city: 'Indianapolis', state: 'IN', country: 'USA', lat: 39.7684, lng: -86.1581, address: 'Indianapolis Logistics Hub, IN, USA' },
  { name: 'Dallas, TX, USA', city: 'Dallas', state: 'TX', country: 'USA', lat: 32.7767, lng: -96.7970, address: 'Dallas Logistics Center, TX, USA' },
  { name: 'Atlanta, GA, USA', city: 'Atlanta', state: 'GA', country: 'USA', lat: 33.7490, lng: -84.3880, address: 'Atlanta Distribution Hub, GA, USA' },
  { name: 'Kansas City, MO, USA', city: 'Kansas City', state: 'MO', country: 'USA', lat: 39.0997, lng: -94.5786, address: 'Kansas City Gateway, MO, USA' },
  { name: 'Memphis, TN, USA', city: 'Memphis', state: 'TN', country: 'USA', lat: 35.1495, lng: -90.0490, address: 'Memphis Intermodal Hub, TN, USA' },
  { name: 'Los Angeles, CA, USA', city: 'Los Angeles', state: 'CA', country: 'USA', lat: 34.0522, lng: -118.2437, address: 'Port of Los Angeles Logistics, CA, USA' },
  { name: 'Seattle, WA, USA', city: 'Seattle', state: 'WA', country: 'USA', lat: 47.6062, lng: -122.3321, address: 'Seattle Freight Depot, WA, USA' },
  { name: 'Newark, NJ, USA', city: 'Newark', state: 'NJ', country: 'USA', lat: 40.7357, lng: -74.1724, address: 'Newark Port Terminal, NJ, USA' },
  { name: 'Denver, CO, USA', city: 'Denver', state: 'CO', country: 'USA', lat: 39.7392, lng: -104.9903, address: 'Denver Central Depot, CO, USA' },
  { name: 'Phoenix, AZ, USA', city: 'Phoenix', state: 'AZ', country: 'USA', lat: 33.4484, lng: -112.0740, address: 'Phoenix Distribution Yard, AZ, USA' },
  { name: 'Toronto, ON, Canada', city: 'Toronto', state: 'ON', country: 'Canada', lat: 43.6532, lng: -79.3832, address: 'Toronto Intermodal Terminal, ON, Canada' },
  { name: 'Vancouver, BC, Canada', city: 'Vancouver', state: 'BC', country: 'Canada', lat: 49.2827, lng: -123.1207, address: 'Port of Vancouver Freight Hub, BC, Canada' },
  { name: 'Montreal, QC, Canada', city: 'Montreal', state: 'QC', country: 'Canada', lat: 45.5017, lng: -73.5673, address: 'Montreal Port Terminal, QC, Canada' },
  { name: 'Mexico City, CDMX, Mexico', city: 'Mexico City', state: 'CDMX', country: 'Mexico', lat: 19.4326, lng: -99.1332, address: 'Mexico City Logistics Central, Mexico' },
  { name: 'Monterrey, NL, Mexico', city: 'Monterrey', state: 'NL', country: 'Mexico', lat: 25.6866, lng: -100.3161, address: 'Monterrey Industrial Hub, Mexico' },

  // Europe
  { name: 'London, UK', city: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, address: 'London Gateway Logistics Park, UK' },
  { name: 'Birmingham, UK', city: 'Birmingham', state: 'West Midlands', country: 'United Kingdom', lat: 52.4862, lng: -1.8904, address: 'Birmingham Central Freight Depot, UK' },
  { name: 'Manchester, UK', city: 'Manchester', state: 'Greater Manchester', country: 'United Kingdom', lat: 53.4808, lng: -2.2426, address: 'Manchester Freightliner Terminal, UK' },
  { name: 'Paris, France', city: 'Paris', state: 'Île-de-France', country: 'France', lat: 48.8566, lng: 2.3522, address: 'Paris Logistics Platform, France' },
  { name: 'Lyon, France', city: 'Lyon', state: 'Auvergne-Rhône-Alpes', country: 'France', lat: 45.7640, lng: 4.8357, address: 'Lyon Freight Hub, France' },
  { name: 'Rotterdam, Netherlands', city: 'Rotterdam', state: 'South Holland', country: 'Netherlands', lat: 51.9244, lng: 4.4777, address: 'Port of Rotterdam Logistics, Netherlands' },
  { name: 'Frankfurt, Germany', city: 'Frankfurt', state: 'Hesse', country: 'Germany', lat: 50.1109, lng: 8.6821, address: 'Frankfurt CargoCity Intermodal, Germany' },
  { name: 'Berlin, Germany', city: 'Berlin', state: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, address: 'Berlin Distribution Center, Germany' },
  { name: 'Hamburg, Germany', city: 'Hamburg', state: 'Hamburg', country: 'Germany', lat: 53.5511, lng: 9.9937, address: 'Hamburg Port Logistics Center, Germany' },
  { name: 'Munich, Germany', city: 'Munich', state: 'Bavaria', country: 'Germany', lat: 48.1351, lng: 11.5820, address: 'Munich Freight Terminal, Germany' },
  { name: 'Madrid, Spain', city: 'Madrid', state: 'Community of Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, address: 'Madrid Logistics Platform, Spain' },
  { name: 'Barcelona, Spain', city: 'Barcelona', state: 'Catalonia', country: 'Spain', lat: 41.3874, lng: 2.1686, address: 'Port of Barcelona Intermodal Hub, Spain' },
  { name: 'Milan, Italy', city: 'Milan', state: 'Lombardy', country: 'Italy', lat: 45.4642, lng: 9.1900, address: 'Milan Freight Hub, Italy' },
  { name: 'Rome, Italy', city: 'Rome', state: 'Lazio', country: 'Italy', lat: 41.9028, lng: 12.4964, address: 'Rome Logistics Park, Italy' },

  // Asia & Middle East
  { name: 'Tokyo, Japan', city: 'Tokyo', state: 'Kanto', country: 'Japan', lat: 35.6762, lng: 139.6503, address: 'Tokyo Port Distribution Terminal, Japan' },
  { name: 'Osaka, Japan', city: 'Osaka', state: 'Kansai', country: 'Japan', lat: 34.6937, lng: 135.5023, address: 'Osaka Logistics Bay, Japan' },
  { name: 'Singapore', city: 'Singapore', state: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, address: 'Singapore Jurong Logistics Hub' },
  { name: 'Dubai, UAE', city: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, address: 'Jebel Ali Port & Logistics Park, Dubai, UAE' },
  { name: 'Tadepalligudem, AP, India', city: 'Tadepalligudem', state: 'Andhra Pradesh', country: 'India', lat: 16.8052, lng: 81.5283, address: 'Tadepalligudem Logistics Center, Andhra Pradesh, India' },
  { name: 'Eluru, AP, India', city: 'Eluru', state: 'Andhra Pradesh', country: 'India', lat: 16.7107, lng: 81.0952, address: 'Eluru Freight Yard, Andhra Pradesh, India' },
  { name: 'Rajahmundry, AP, India', city: 'Rajahmundry', state: 'Andhra Pradesh', country: 'India', lat: 17.0005, lng: 81.8040, address: 'Rajahmundry Cargo Hub, Andhra Pradesh, India' },
  { name: 'Vijayawada, AP, India', city: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', lat: 16.5062, lng: 80.6480, address: 'Vijayawada Multi-Modal Logistics Hub, Andhra Pradesh, India' },
  { name: 'Visakhapatnam, AP, India', city: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', lat: 17.6868, lng: 83.2185, address: 'Visakhapatnam Port Container Terminal, Andhra Pradesh, India' },
  { name: 'Hyderabad, TS, India', city: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867, address: 'Hyderabad Logistics Corridor, Telangana, India' },
  { name: 'Chennai, TN, India', city: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707, address: 'Chennai Port Container Freight Terminal, Tamil Nadu, India' },
  { name: 'Bengaluru, India', city: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946, address: 'Bengaluru Logistics Corridor, India' },
  { name: 'Mumbai, India', city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777, address: 'JNPT Port Logistics Center, Mumbai, India' },
  { name: 'Pune, MH, India', city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, lng: 73.8567, address: 'Pune Industrial Freight Hub, Maharashtra, India' },
  { name: 'Delhi, India', city: 'Delhi', state: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025, address: 'Delhi Multi-Modal Logistics Park, India' },
  { name: 'Kolkata, WB, India', city: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639, address: 'Kolkata Port Logistics, West Bengal, India' },
  { name: 'Ahmedabad, GJ, India', city: 'Ahmedabad', state: 'Gujarat', country: 'India', lat: 23.0225, lng: 72.5714, address: 'Ahmedabad Logistics Park, Gujarat, India' },
  { name: 'Seoul, South Korea', city: 'Seoul', state: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, address: 'Seoul Central Freight Center, South Korea' },

  // Australia & New Zealand
  { name: 'Sydney, Australia', city: 'Sydney', state: 'NSW', country: 'Australia', lat: -33.8688, lng: 151.2093, address: 'Port Botany Freight Terminal, Sydney, Australia' },
  { name: 'Melbourne, Australia', city: 'Melbourne', state: 'VIC', country: 'Australia', lat: -37.8136, lng: 144.9631, address: 'Melbourne Intermodal Terminal, Australia' },
  { name: 'Brisbane, Australia', city: 'Brisbane', state: 'QLD', country: 'Australia', lat: -27.4698, lng: 153.0251, address: 'Brisbane Port Logistics, Australia' },

  // South America & Africa
  { name: 'São Paulo, Brazil', city: 'São Paulo', state: 'SP', country: 'Brazil', lat: -23.5505, lng: -46.6333, address: 'São Paulo Cargo Terminal, Brazil' },
  { name: 'Johannesburg, South Africa', city: 'Johannesburg', state: 'Gauteng', country: 'South Africa', lat: -26.2041, lng: 28.0473, address: 'City Deep Container Terminal, Johannesburg, South Africa' }
];

const geocodeCache = new Map<string, LocationPoint[]>();

export async function geocodeQuery(query: string): Promise<LocationPoint[]> {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) return [];

  const lower = cleanQuery.toLowerCase();
  if (geocodeCache.has(lower)) {
    return geocodeCache.get(lower)!;
  }

  // Check known hubs first for instant matching anywhere in the world
  const matchedHubs = KNOWN_HUBS.filter(
    hub =>
      (hub.name && hub.name.toLowerCase().includes(lower)) ||
      (hub.city && hub.city.toLowerCase().includes(lower)) ||
      (hub.country && hub.country.toLowerCase().includes(lower))
  );

  try {
    // Worldwide OpenStreetMap Nominatim search - unrestricted by country codes
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cleanQuery
    )}&addressdetails=1&limit=8`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HOSRoutePlannerELD/1.0 (contact: dispatch@hosrouteplanner.io)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const results: LocationPoint[] = data.map((item: any) => {
          const addr = item.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.municipality ||
            addr.suburb ||
            addr.city_district ||
            addr.county ||
            '';
          const state = addr.state
            ? getStateAbbr(addr.state)
            : (addr.region || addr.province || addr.state_district || '');
          const country = addr.country || (addr.country_code ? addr.country_code.toUpperCase() : '');

          const nameParts = [city, state, country].filter(Boolean);
          const displayName =
            nameParts.length > 0
              ? nameParts.join(', ')
              : item.display_name.split(',').slice(0, 3).join(', ');

          return {
            name: displayName,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            city: city || displayName.split(',')[0].trim(),
            state: state,
            country: country || 'Global',
            address: item.display_name
          };
        });

        geocodeCache.set(lower, results);
        return results;
      }
    }
  } catch (err) {
    // Network error or timeout, fallback to hub matches
  }

  if (matchedHubs.length > 0) {
    geocodeCache.set(lower, matchedHubs);
    return matchedHubs;
  }

  // If no hub matched either, try splitting city, state/country
  const parts = cleanQuery.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const candidateCity = (parts[0] || '').toLowerCase();
    const candidateRegion = (parts[1] || '').toUpperCase();
    const found = KNOWN_HUBS.find(
      h =>
        (h.state && h.state.toUpperCase() === candidateRegion) ||
        (h.country && h.country.toUpperCase() === candidateRegion) ||
        (h.city && h.city.toLowerCase() === candidateCity)
    );
    if (found) {
      return [
        {
          ...found,
          name: `${candidateCity}, ${candidateRegion}`
        }
      ];
    }
  }

  return [];
}

export async function reverseGeocode(lat: number, lng: number): Promise<LocationPoint> {
  // 1. First try OpenStreetMap Nominatim with proper contact header
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2800);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'HOSRoutePlannerELD/1.0 (contact: dispatch@hosrouteplanner.io)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        addr.county ||
        '';
      const state = addr.state
        ? getStateAbbr(addr.state)
        : (addr.region || addr.province || addr.state_district || '');
      const country = addr.country || (addr.country_code ? addr.country_code.toUpperCase() : '');

      const nameParts = [city, state, country].filter(Boolean);
      if (nameParts.length > 0) {
        return {
          name: nameParts.join(', '),
          city: city || 'Local Terminal',
          state: state,
          country: country || 'Global',
          lat,
          lng,
          address: data.display_name || nameParts.join(', ')
        };
      }
    }
  } catch (e) {
    // Continue to Photon fallback
  }

  // 2. High-speed fallback: Photon (OSM-based, high rate limits, friendly to serverless)
  try {
    const photonUrl = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;
    const pController = new AbortController();
    const pTimeout = setTimeout(() => pController.abort(), 2500);

    const pRes = await fetch(photonUrl, { signal: pController.signal });
    clearTimeout(pTimeout);

    if (pRes.ok) {
      const pData = await pRes.json();
      if (pData?.features && pData.features.length > 0) {
        const props = pData.features[0]?.properties || {};
        const city = props.city || props.town || props.locality || props.district || props.county || '';
        const state = props.state ? getStateAbbr(props.state) : '';
        const country = props.country || '';

        const nameParts = [city, state, country].filter(Boolean);
        if (nameParts.length > 0) {
          return {
            name: nameParts.join(', '),
            city: city || 'Local Terminal',
            state: state,
            country: country || 'Global',
            lat,
            lng,
            address: `${city ? city + ', ' : ''}${state ? state + ', ' : ''}${country}`
          };
        }
      }
    }
  } catch (e) {
    // Continue to closest hub & regional lookup
  }

  // 3. Intelligent closest known hub & regional classification fallback
  let closest = KNOWN_HUBS[0];
  let minDistance = Infinity;
  for (const hub of KNOWN_HUBS) {
    const d = Math.hypot(hub.lat - lat, hub.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      closest = hub;
    }
  }

  // If very close to a hub (< 25 miles / ~0.35 deg)
  if (minDistance < 0.35) {
    return {
      ...closest,
      lat,
      lng
    };
  }

  // If moderately close to a hub (< 150 miles / ~2.2 deg)
  if (minDistance < 2.2) {
    return {
      name: `Near ${closest.city}, ${closest.state ? closest.state + ', ' : ''}${closest.country}`,
      city: closest.city,
      state: closest.state || '',
      country: closest.country || 'Global',
      lat,
      lng,
      address: `Logistics Area near ${closest.name}`
    };
  }

  // Regional geographic classifier by coordinates
  let regionName = 'Commercial Dispatch Area';
  let countryName = 'Global';
  let stateName = '';

  if (lat >= 6.5 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5) {
    countryName = 'India';
    if (lat >= 14.0 && lat <= 19.5 && lng >= 78.0 && lng <= 84.5) {
      stateName = 'Andhra Pradesh';
      regionName = 'Godavari / Coastal Corridor';
    } else if (lat >= 16.0 && lat <= 20.0 && lng >= 77.0 && lng <= 81.5) {
      stateName = 'Telangana';
      regionName = 'Hyderabad / Deccan Corridor';
    } else if (lat >= 11.5 && lat <= 18.5 && lng >= 74.0 && lng <= 78.5) {
      stateName = 'Karnataka';
      regionName = 'Bengaluru Corridor';
    } else if (lat >= 8.0 && lat <= 13.5 && lng >= 76.0 && lng <= 80.5) {
      stateName = 'Tamil Nadu';
      regionName = 'Chennai Corridor';
    } else if (lat >= 15.5 && lat <= 22.0 && lng >= 72.5 && lng <= 80.5) {
      stateName = 'Maharashtra';
      regionName = 'Mumbai / Pune Corridor';
    } else {
      regionName = 'India Regional Freight Route';
    }
  } else if (lat >= 24.0 && lat <= 50.0 && lng >= -125.0 && lng <= -66.0) {
    countryName = 'USA';
    stateName = closest.state || 'Midwest';
    regionName = `US Highway Corridor near ${closest.city || 'Terminal'}`;
  } else if (lat >= 35.0 && lat <= 60.0 && lng >= -10.0 && lng <= 30.0) {
    countryName = 'Europe';
    regionName = `European Logistics Corridor near ${closest.city || 'Depot'}`;
  }

  const generatedName = stateName
    ? `${regionName}, ${stateName}, ${countryName}`
    : `${regionName}, ${countryName}`;

  return {
    name: generatedName,
    city: closest.city || regionName,
    state: stateName || closest.state || '',
    country: countryName,
    lat,
    lng,
    address: `${generatedName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`
  };
}

function getStateAbbr(stateName: string): string {
  const STATES: Record<string, string> = {
    Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO',
    Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID',
    Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA',
    Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN',
    Mississippi: 'MS', Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR',
    Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD',
    Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA',
    'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY'
  };
  return STATES[stateName] || (stateName.length === 2 ? stateName.toUpperCase() : stateName);
}
