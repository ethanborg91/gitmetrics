'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '../actions/auth';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialUserEmail }: { children: ReactNode; initialUserEmail?: string | null }) {
  const [user, setUser] = useState<{ email: string } | null>(initialUserEmail ? { email: initialUserEmail } : null);
  const [loading, setLoading] = useState(!initialUserEmail);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const tryClientCookie = () => {
        if (typeof document === 'undefined') return null;
        const raw = document.cookie
          .split('; ')
          .find((row) => row.startsWith('authToken='))
          ?.split('=')[1];
        if (!raw) return null;
        try {
          const token = decodeURIComponent(raw);
          const decoded = jwtDecode<{ sub: string }>(token);
          return { email: decoded.sub } as { email: string };
        } catch {
          return null;
        }
      };

      // If we already have an initial user from the server, keep it but still verify
      const optimisticUser = initialUserEmail ? { email: initialUserEmail } : tryClientCookie();
      if (optimisticUser && !user) {
        setUser(optimisticUser);
      }

      try {
        const response = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setUser({ email: data.email });
        } else {
          setUser(optimisticUser ?? null);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        setUser(optimisticUser ?? null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const logout = async () => {
    setUser(null);
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout failed', error);
      router.push('/login'); // Fallback
    }
  };

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
