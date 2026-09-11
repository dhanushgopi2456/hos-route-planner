import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterPayload } from '../types/auth';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  demoUsers: Array<any>;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; error?: string }>;
  loginAsDemo: (demoEmail: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'hos_auth_token';
const USER_KEY = 'hos_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authToast, error: toastError, success: toastSuccess } = useToast();

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState<any[]>([]);

  // Fetch demo users for easy testing
  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const res = await fetch('/api/auth/demo-users');
        if (res.ok) {
          const data = await res.json();
          setDemoUsers(data.demo_users || []);
        }
      } catch (err) {
        console.error('Failed to load demo accounts:', err);
      }
    };
    fetchDemos();
  }, []);

  // Verify stored session on boot
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        } else {
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      } catch (err) {
        console.error('Session verification failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();
      if (!res.ok) {
        toastError('Sign In Failed', data.error || 'Invalid credentials. Please try again.');
        return { success: false, error: data.error || 'Login failed' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      authToast(
        `Welcome Back, ${data.user.name}!`,
        `Signed in as ${data.user.role.toUpperCase()} (${data.user.carrier_name}). CDL: ${data.user.cdl_number || 'N/A'}. Log credentials auto-synced.`,
        true
      );

      return { success: true, message: data.message };
    } catch (err: any) {
      const msg = err.message || 'Connection error. Please try again.';
      toastError('Connection Error', msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (demoEmail: string) => {
    return login({ email: demoEmail, password: 'password123' });
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        toastError('Registration Failed', data.error || 'Registration failed');
        return { success: false, error: data.error || 'Registration failed' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      authToast(
        `Welcome to Fleet HOS, ${data.user.name}!`,
        `Commercial account created for ${data.user.carrier_name}. Ready to plan compliant routes.`,
        true
      );

      return { success: true, message: data.message };
    } catch (err: any) {
      const msg = err.message || 'Registration connection error';
      toastError('Registration Error', msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const prevDriver = user?.name;
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      authToast(
        'Logged Out Successfully',
        prevDriver
          ? `Safe travels, ${prevDriver}! You have been signed out. Stay alert on the road.`
          : 'You have been signed out of your driver session.',
        false
      );
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem(USER_KEY, JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        demoUsers,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
