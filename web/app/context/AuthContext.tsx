'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logoutAction } from '../actions/auth';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUserEmail,
}: {
  children: ReactNode;
  initialUserEmail?: string | null;
}) {
  const [user, setUser] = useState<{ email: string } | null>(
    initialUserEmail ? { email: initialUserEmail } : null,
  );
  const [loading, setLoading] = useState(!initialUserEmail);
  const router = useRouter();
  const pathname = usePathname();

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

  const loadUser = async () => {
    setLoading(true);
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

  useEffect(() => {
    loadUser();
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const optimisticUser = tryClientCookie();
    if (optimisticUser) {
      setUser(optimisticUser);
    }

    try {
      const response = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setUser({ email: data.email });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout failed', error);
      router.push('/login'); // Fallback
    }
  }, [router]);

  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    loadUser().then(() => {
      const authPages = ['/login', '/signup'];
      if (!authPages.includes(pathname) && pathname !== '/dashboard' && user) {
        logout();
      }
    });
  }, []);

  useEffect(() => {
    if (previousPath.current === '/dashboard' && pathname !== '/dashboard' && user && !loading) {
      logout();
    }
    previousPath.current = pathname;
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
