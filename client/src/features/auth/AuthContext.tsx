import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { getMe as getMeApi, login as loginApi } from './authApi';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const persistSession = (nextUser: User, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem('token', nextToken);
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (!token) return;
    getMeApi()
      .then((freshUser) => {
        setUser(freshUser);
      })
      .catch(() => {
        clearSession();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const data = await loginApi({ username, password });
    const nextUser: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    };
    persistSession(nextUser, data.accessToken);
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
