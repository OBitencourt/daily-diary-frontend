import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { useCookies } from 'react-cookie';
import api from '../services/api';
import type { User } from '../types/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['sentia_token']);

  useEffect(() => {
    const loadUser = async () => {
      const token = cookies.sentia_token;
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (err) {
          removeCookie('sentia_token', { path: '/' });
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [cookies.sentia_token, removeCookie]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setCookie('sentia_token', res.data.token, { 
      path: '/', 
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax'
    });
    const userRes = await api.get('/auth/me');
    setUser(userRes.data.data);
    return res.data;
  };

  const register = async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    setCookie('sentia_token', res.data.token, { 
      path: '/', 
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax'
    });
    const userRes = await api.get('/auth/me');
    setUser(userRes.data.data);
    return res.data;
  };

  const logout = () => {
    removeCookie('sentia_token', { path: '/' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
