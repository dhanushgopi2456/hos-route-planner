export type UserRole = 'driver' | 'dispatcher' | 'fleet_manager';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cdl_number?: string;
  carrier_name: string;
  carrier_office: string;
  truck_number: string;
  trailer_number: string;
  current_cycle_used: number;
  avatar_url?: string;
  theme_preference: ThemeMode;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  cdl_number?: string;
  carrier_name: string;
  carrier_office: string;
  truck_number: string;
  trailer_number: string;
  current_cycle_used: number;
}
