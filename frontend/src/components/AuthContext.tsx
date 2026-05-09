import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import type { UserDto } from '../services/authService';

interface AuthContextType {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Could be replaced with a spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user, logout }}>
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
