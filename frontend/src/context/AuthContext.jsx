import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginFarmer, registerFarmer, logoutFarmer, getFarmerProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fms_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('fms_token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize profile on initial mount if token is present
  useEffect(() => {
    async function verifySession() {
      if (token) {
        try {
          const profile = await getFarmerProfile();
          setUser(profile);
          localStorage.setItem('fms_user', JSON.stringify(profile));
        } catch (error) {
          console.warn('Session verification failed, logging out:', error);
          logout();
        }
      }
      setLoading(false);
    }
    verifySession();
  }, [token]);

  const login = async (credentials) => {
    const res = await loginFarmer(credentials);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('fms_token', res.token);
      localStorage.setItem('fms_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (farmerData) => {
    const res = await registerFarmer(farmerData);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('fms_token', res.token);
      localStorage.setItem('fms_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    await logoutFarmer();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
