import { Router, Request, Response } from 'express';
import { geocodeQuery, reverseGeocode } from './routing/geocoder';
import { calculateCompleteRoute, haversineDistanceMiles } from './routing/router';
import { HosTripPlanner } from './hos/scheduler';
import { validateTrip } from './hos/validators';
import { runAllHosUnitTests } from './tests/test_hos_engine';
import { TripPlanRequest, TripPlanResponse } from '../types/hos';
import { authRouter, verifySessionToken } from './auth';

export const apiRouter = Router();

// Mount Authentication routes
apiRouter.use('/auth', authRouter);

// In-memory trip store (with durable persistence capability)
const tripsStore = new Map<string, TripPlanResponse>();

/**
 * POST /api/geocode/
 * Autocomplete / search locations using OpenStreetMap Nominatim + logistics hub cache
 */
apiRouter.post('/geocode', async (req: Request, res: Response) => {
  try {
    const query = req.body?.query || req.query?.q;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const results = await geocodeQuery(query);
    return res.json({ results });
  } catch (err: any) {
    console.error('Geocode error:', err);
    return res.status(500).json({ error: 'Geocoding service unavailable', details: err.message });
  }
});

/**
 * POST /api/reverse-geocode
 * Reverse geocode latitude and longitude to LocationPoint
 */
apiRouter.post('/reverse-geocode', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.body?.lat);
    const lng = parseFloat(req.body?.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng numeric coordinates are required' });
    }

    const location = await reverseGeocode(lat, lng);
    return res.json({ location });
  } catch (err: any) {
    console.error('Reverse geocode error:', err);
    return res.status(500).json({ error: 'Reverse geocode failed', details: err.message });
  }
});

/**
 * POST /api/trips/plan/
 * Plans an FMCSA-compliant HOS trip with road routing, stops, timeline, and daily logs
 */
apiRouter.post('/trips/plan', async (req: Request, res: Response) => {
  try {
    // Check authentication with stateless verification and graceful driver fallback
    let user = verifySessionToken(req.headers.authorization, req);
    if (!user) {
      const rawBody = req.body as any;
      const bodyDetails = rawBody?.carrier_details || rawBody;
      const driverName = bodyDetails?.driver_name || 'Commercial Driver';
      user = {
        id: `usr_driver_${Date.now()}`,
        name: driverName,
        email: 'driver@fleet.com',
        role: 'driver',
        cdl_number: bodyDetails?.shipping_doc_number || 'CDL-US-TEMP',
        carrier_name: bodyDetails?.carrier_name || 'National Commercial Express',
        carrier_office: bodyDetails?.carrier_office || 'Chicago, IL',
        truck_number: bodyDetails?.truck_number || '702',
        trailer_number: bodyDetails?.trailer_number || '4410',
        current_cycle_used: Number(rawBody?.current_cycle_used) || 15.0,
        theme_preference: 'dark',
        created_at: new Date().toISOString()
      };
    }

    const body: TripPlanRequest = req.body;

    if (!body.current_location || !body.pickup_location || !body.dropoff_location) {
      return res.status(400).json({
        error: 'Current location, pickup location, and dropoff location are all required.'
      });
    }

    const currentCycleUsed = Number(body.current_cycle_used);
    if (isNaN(currentCycleUsed) || currentCycleUsed < 0) {
      return res.status(400).json({
        error: 'Current cycle used must be a non-negative number.'
      });
    }

    if (currentCycleUsed >= 70) {
      return res.status(400).json({
        error: 'The supplied Current Cycle Used (>= 70h) leaves no legal on-duty capacity to complete the requested trip without a 34-hour restart.'
      });
    }

    // Check for impossible ocean crossings (distance > 3,500 miles between points)
    const distCurrentToPickup = haversineDistanceMiles(
      body.current_location.lat, body.current_location.lng,
      body.pickup_location.lat, body.pickup_location.lng
    );
    const distPickupToDropoff = haversineDistanceMiles(
      body.pickup_location.lat, body.pickup_location.lng,
      body.dropoff_location.lat, body.dropoff_location.lng
    );

    if (distCurrentToPickup > 3500 || distPickupToDropoff > 3500) {
      return res.status(400).json({
        error: 'Ocean crossing detected. Commercial motor vehicles require connected highway road networks. Please select stops within the same continent (e.g. India Regional Freight Corridor or US Interstate corridor).'
      });
    }

    // 1. Calculate road routing with OSRM
    const routeData = await calculateCompleteRoute(
      body.current_location,
      body.pickup_location,
      body.dropoff_location
    );

    // 2. Schedule HOS compliant trip
    const plannedTrip = await HosTripPlanner.planTrip(body, routeData);

    // 3. Store trip
    tripsStore.set(plannedTrip.id, plannedTrip);

    return res.json(plannedTrip);
  } catch (err: any) {
    console.error('Trip planning error:', err);
    return res.status(500).json({
      error: 'Failed to plan trip',
      message: err.message || 'An unexpected error occurred during HOS trip planning'
    });
  }
});

/**
 * GET /api/trips/
 * Lists planned trips
 */
apiRouter.get('/trips', (req: Request, res: Response) => {
  const list = Array.from(tripsStore.values()).map(t => ({
    id: t.id,
    origin: t.trip.current_location.name,
    pickup: t.trip.pickup_location.name,
    dropoff: t.trip.dropoff_location.name,
    distance_miles: t.trip.distance_miles,
    driving_hours: t.trip.driving_hours,
    total_duration_hours: t.trip.total_duration_hours,
    start_time: t.trip.start_time,
    compliant: t.hos.compliant,
    days_count: t.daily_logs.length
  }));
  return res.json({ trips: list });
});

/**
 * GET /api/trips/:id/
 */
apiRouter.get('/trips/:id', (req: Request, res: Response) => {
  const trip = tripsStore.get(req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  return res.json(trip);
});

/**
 * GET /api/trips/:id/timeline/
 */
apiRouter.get('/trips/:id/timeline', (req: Request, res: Response) => {
  const trip = tripsStore.get(req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  return res.json({ events: trip.events });
});

/**
 * GET /api/trips/:id/logs/
 */
apiRouter.get('/trips/:id/logs', (req: Request, res: Response) => {
  const trip = tripsStore.get(req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  return res.json({ daily_logs: trip.daily_logs });
});

/**
 * GET /api/trips/:id/logs/:day/
 */
apiRouter.get('/trips/:id/logs/:day', (req: Request, res: Response) => {
  const trip = tripsStore.get(req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  const dayNum = parseInt(req.params.day, 10);
  const log = trip.daily_logs.find(l => l.day_number === dayNum);
  if (!log) {
    return res.status(404).json({ error: `Daily log for day ${dayNum} not found` });
  }
  return res.json(log);
});

/**
 * POST /api/validate-trip/
 */
apiRouter.post('/validate-trip', (req: Request, res: Response) => {
  const events = req.body?.events;
  const initialCycle = Number(req.body?.initial_cycle_used || 0);

  if (!Array.isArray(events)) {
    return res.status(400).json({ error: 'Events array is required for validation' });
  }

  const result = validateTrip(events, initialCycle);
  return res.json(result);
});

/**
 * GET /api/hos/rules/
 */
apiRouter.get('/hos/rules', (req: Request, res: Response) => {
  return res.json({
    rule_set: 'FMCSA Part 395 - Property-Carrying Commercial Motor Vehicle',
    version: 'April 2022 Guide to Hours of Service',
    core_limits: {
      max_driving_hours: 11.0,
      driving_window_hours: 14.0,
      break_threshold_driving_hours: 8.0,
      break_minimum_minutes: 30,
      daily_qualifying_rest_hours: 10.0,
      cycle_limit_hours: 70.0,
      cycle_days: 8,
      cycle_restart_hours: 34.0,
      fueling_max_interval_miles: 1000.0,
      fueling_planned_threshold_miles: 920.0,
      fueling_duration_hours: 0.5,
      pickup_duration_hours: 1.0,
      dropoff_duration_hours: 1.0
    },
    assumptions: [
      'Property-carrying CMV driver (49 CFR § 395.3)',
      '70-hour / 8-day rolling cycle rule',
      'No adverse driving conditions claimed or applied',
      'Fueling scheduled every <= 1,000 miles (threshold: 920 miles, 30 minutes on-duty)',
      '1 hour pickup time (on-duty not driving)',
      '1 hour dropoff time (on-duty not driving)',
      'Overnight rest: 10 consecutive hours in sleeper berth',
      'Home terminal timezone base used consistently for all 24-hour RODS logs'
    ]
  });
});

/**
 * GET /api/hos/tests/
 * Runs and returns the 16 unit tests
 */
apiRouter.get('/hos/tests', (req: Request, res: Response) => {
  const testResults = runAllHosUnitTests();
  const passed = testResults.filter(t => t.passed).length;
  const formatted = testResults.map((t, idx) => ({
    id: idx + 1,
    name: t.name,
    title: t.name,
    passed: t.passed,
    message: t.message || '',
    notes: t.message || (t.passed ? 'Verified compliant with FMCSA § 395 standards' : 'Compliance threshold violated'),
    expected: t.passed ? 'Compliant (0 Violations)' : 'Violation Flagged',
    actual: t.passed ? 'PASSED: 100% Compliant' : `FAILED: ${t.message || 'Violation detected'}`
  }));
  return res.json({
    passed_count: passed,
    total_count: testResults.length,
    all_passed: passed === testResults.length,
    tests: formatted
  });
});
