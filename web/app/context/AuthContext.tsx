'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ email: string }>(token);
        setUser({ email: decoded.email });
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Login failed');
      const { access_token } = await res.json();
      Cookies.set('authToken', access_token, { secure: true, httpOnly: true, sameSite: 'strict' });
      const decoded: { email: string } = jwtDecode(access_token);
      setUser({ email: decoded.email });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Signup failed');
      const { access_token } = await res.json();
      Cookies.set('authToken', access_token, { secure: true, httpOnly: true, sameSite: 'strict' });
      const decoded: { email: string } = jwtDecode(access_token);
      setUser({ email: decoded.email });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    Cookies.remove('authToken');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
