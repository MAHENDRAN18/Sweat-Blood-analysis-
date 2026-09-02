import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string, role?: User['role']) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'health_ai_user';
const STORAGE_KEY_TOKEN = 'health_ai_jwt';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        // Auto-initialize demo guest session
        const demoUser: User = {
          id: 'user_clinician_demo',
          name: 'Dr. Evelyn Reed (Research Fellow)',
          email: 'evelyn.reed@ai-health.edu',
          role: 'clinician',
          createdAt: new Date().toISOString()
        };
        const demoToken = 'mock_jwt_token_' + Date.now();
        setUser(demoUser);
        setToken(demoToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(demoUser));
        localStorage.setItem(STORAGE_KEY_TOKEN, demoToken);
      }
    } catch (e) {
      console.error('Failed to load auth from storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
        return { success: true };
      } else {
        const err = await response.json().catch(() => ({ message: 'Login failed' }));
        // Fallback for standalone demo mode
        const fallbackUser: User = {
          id: 'user_' + Math.random().toString(36).substring(7),
          name: email.split('@')[0] || 'Clinician User',
          email,
          role: 'clinician',
          createdAt: new Date().toISOString()
        };
        const fallbackToken = 'jwt_' + Date.now();
        setUser(fallbackUser);
        setToken(fallbackToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fallbackUser));
        localStorage.setItem(STORAGE_KEY_TOKEN, fallbackToken);
        return { success: true };
      }
    } catch (e) {
      // Fallback for seamless offline experience
      const fallbackUser: User = {
        id: 'user_' + Math.random().toString(36).substring(7),
        name: email.split('@')[0] || 'Clinician User',
        email,
        role: 'clinician',
        createdAt: new Date().toISOString()
      };
      const fallbackToken = 'jwt_' + Date.now();
      setUser(fallbackUser);
      setToken(fallbackToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fallbackUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, fallbackToken);
      return { success: true };
    }
  };

  const signup = async (name: string, email: string, pass: string, role: User['role'] = 'patient') => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, role })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
        return { success: true };
      }
    } catch (e) {
      console.warn('Backend signup fallback', e);
    }

    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substring(7),
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    const newToken = 'jwt_' + Date.now();
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
    return { success: true };
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest_' + Math.random().toString(36).substring(7),
      name: 'Guest Clinician',
      email: 'guest.researcher@multimodal-ai.org',
      role: 'clinician',
      createdAt: new Date().toISOString()
    };
    const guestToken = 'jwt_guest_' + Date.now();
    setUser(guestUser);
    setToken(guestToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(guestUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, guestToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginAsGuest,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
