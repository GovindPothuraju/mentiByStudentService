import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mentiby_student_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('mentiby_student_user', JSON.stringify(res.data.user));
      }
    } catch {
      setUser(null);
      localStorage.removeItem('mentiby_student_token');
      localStorage.removeItem('mentiby_student_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('mentiby_student_token');
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.data?.user) {
      setUser(res.data.user);
      setAuthModal({ isOpen: false, mode: 'login' });
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    if (res.data?.user) {
      setUser(res.data.user);
      setAuthModal({ isOpen: false, mode: 'login' });
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
