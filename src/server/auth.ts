import { Router, Request, Response } from 'express';
import { User, UserRole, ThemeMode } from '../types/auth';

export const authRouter = Router();

// In-memory demo & registered user database
const usersDatabase = new Map<string, { user: User; passwordHash: string }>();
const sessionsDatabase = new Map<string, string>(); // token -> userId

// Seed standard demo users
const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: 'usr-driver-john',
    name: 'John E. Doe',
    email: 'john.doe@trucking.com',
    password: 'password123',
    role: 'driver',
    cdl_number: 'CDL-TX-9874521',
    carrier_name: "John Doe's Transportation",
    carrier_office: 'Washington, D.C.',
    truck_number: '123',
    trailer_number: '20544',
    current_cycle_used: 42.5,
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    theme_preference: 'dark',
    created_at: new Date('2025-01-15').toISOString()
  },
  {
    id: 'usr-driver-maria',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@freightway.com',
    password: 'password123',
    role: 'driver',
    cdl_number: 'CDL-FL-4412980',
    carrier_name: 'Eagle Regional Logistics',
    carrier_office: 'Atlanta, GA',
    truck_number: '488',
    trailer_number: '30981',
    current_cycle_used: 28.0,
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    theme_preference: 'light',
    created_at: new Date('2025-02-01').toISOString()
  },
  {
    id: 'usr-disp-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@dispatchfleet.com',
    password: 'password123',
    role: 'dispatcher',
    cdl_number: 'DISP-CERT-1092',
    carrier_name: 'National Freight Dispatch',
    carrier_office: 'Chicago, IL',
    truck_number: 'Fleet-Command',
    trailer_number: 'All Units',
    current_cycle_used: 0.0,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    theme_preference: 'dark',
    created_at: new Date('2025-01-10').toISOString()
  }
];

// Initialize users
DEMO_USERS.forEach(u => {
  const { password, ...userData } = u;
  usersDatabase.set(userData.email.toLowerCase(), {
    user: userData,
    passwordHash: password
  });
  // Pre-seed persistent demo tokens
  sessionsDatabase.set(`eld_token_${userData.id}_persistent`, userData.id);
});

// Helper: generate mock token
function generateToken(userId: string): string {
  const randomStr = Math.random().toString(36).substring(2, 15);
  const token = `eld_token_${userId}_${Date.now()}_${randomStr}`;
  sessionsDatabase.set(token, userId);
  return token;
}

/**
 * Verify session token and return the associated User or null
 */
export function verifySessionToken(authHeader: string | undefined | null): User | null {
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  // 1. Direct session check
  const userId = sessionsDatabase.get(token);
  if (userId) {
    for (const record of usersDatabase.values()) {
      if (record.user.id === userId) {
        return record.user;
      }
    }
  }

  // 2. Fallback check for persistent or reloaded sessions containing userId
  for (const record of usersDatabase.values()) {
    if (token.includes(record.user.id)) {
      sessionsDatabase.set(token, record.user.id);
      return record.user;
    }
  }

  return null;
}

/**
 * GET /api/auth/demo-users
 * Returns available demo accounts for 1-click test login
 */
authRouter.get('/demo-users', (req: Request, res: Response) => {
  const demoList = DEMO_USERS.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    cdl_number: u.cdl_number,
    carrier_name: u.carrier_name,
    current_cycle_used: u.current_cycle_used,
    avatar_url: u.avatar_url
  }));
  res.json({ demo_users: demoList });
});

/**
 * POST /api/auth/login
 */
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const record = usersDatabase.get(email.toLowerCase());
  if (!record) {
    return res.status(401).json({
      error: 'Invalid credentials. Please verify your email or use a 1-click demo driver account.'
    });
  }

  // If password provided and doesn't match
  if (password && record.passwordHash && record.passwordHash !== password) {
    return res.status(401).json({ error: 'Incorrect password provided.' });
  }

  const token = generateToken(record.user.id);
  res.json({
    token,
    user: record.user,
    message: `Welcome back, ${record.user.name}!`
  });
});

/**
 * POST /api/auth/register
 */
authRouter.post('/register', (req: Request, res: Response) => {
  const {
    name,
    email,
    password = 'password123',
    role = 'driver',
    cdl_number = 'CDL-PENDING-001',
    carrier_name = "Independent Operator",
    carrier_office = "Springfield, IL",
    truck_number = "101",
    trailer_number = "501",
    current_cycle_used = 15.0
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Full name and email are required to register.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (usersDatabase.has(normalizedEmail)) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    role: role as UserRole,
    cdl_number: cdl_number || 'CDL-US-TEMP',
    carrier_name: carrier_name || "Commercial Carrier Co.",
    carrier_office: carrier_office || "Chicago, IL",
    truck_number: truck_number || "101",
    trailer_number: trailer_number || "501",
    current_cycle_used: Number(current_cycle_used) || 0,
    theme_preference: 'dark',
    created_at: new Date().toISOString()
  };

  usersDatabase.set(normalizedEmail, {
    user: newUser,
    passwordHash: password
  });

  const token = generateToken(newUser.id);
  res.status(201).json({
    token,
    user: newUser,
    message: `Account created successfully. Welcome aboard, ${newUser.name}!`
  });
});

/**
 * GET /api/auth/me
 */
authRouter.get('/me', (req: Request, res: Response) => {
  const user = verifySessionToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token. Please log in.' });
  }
  return res.json({ user });
});

/**
 * POST /api/auth/logout
 */
authRouter.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    sessionsDatabase.delete(token);
  }
  res.json({ message: 'Logged out successfully' });
});

/**
 * PATCH /api/auth/theme
 */
authRouter.patch('/theme', (req: Request, res: Response) => {
  const { theme_preference } = req.body;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    const userId = sessionsDatabase.get(token);

    if (userId) {
      for (const record of usersDatabase.values()) {
        if (record.user.id === userId && theme_preference) {
          record.user.theme_preference = theme_preference as ThemeMode;
          return res.json({ success: true, theme_preference: record.user.theme_preference });
        }
      }
    }
  }

  res.json({ success: true, theme_preference });
});
