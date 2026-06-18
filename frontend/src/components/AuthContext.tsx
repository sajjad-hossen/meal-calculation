import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import type { UserDto } from '../services/authService';
import { fetchJson } from '../services/api';

interface AuthContextType {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  isPaymentActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isPaymentActive, setIsPaymentActive] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      fetchJson<{ isPaidForCurrentMonth: boolean }>('/Mess/status')
        .then(data => setIsPaymentActive(data.isPaidForCurrentMonth))
        .catch(() => setIsPaymentActive(false));
    } else {
      setIsPaymentActive(true);
    }
  }, [user]);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsPaymentActive(true);
  };

  if (loading) {
    return <div>Loading...</div>; // Could be replaced with a spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user, logout, isPaymentActive }}>
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
