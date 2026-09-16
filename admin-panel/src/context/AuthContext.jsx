import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('gp_admin_user');
      if (storedUser) {
        let parsed = JSON.parse(storedUser);
        if (parsed.name === 'Shivraj Administrator' || parsed.mobile === '9876543210' || (parsed.role === 'admin' && parsed.name?.includes('Shivraj'))) {
          parsed.name = 'Yuvraj Jadhav';
          parsed.mobile = '7666718978';
          localStorage.setItem('gp_admin_user', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('gp_admin_user');
    const token = localStorage.getItem('gp_admin_token');
    if (storedUser && token) {
      try {
        let parsed = JSON.parse(storedUser);
        if (parsed.name === 'Shivraj Administrator' || parsed.mobile === '9876543210' || (parsed.role === 'admin' && parsed.name?.includes('Shivraj'))) {
          parsed.name = 'Yuvraj Jadhav';
          parsed.mobile = '7666718978';
          localStorage.setItem('gp_admin_user', JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const res = await api.post('/auth/login', { identifier, password });
      if (res.data.success) {
        const userData = res.data.data;
        if (userData.role === 'citizen') {
          throw new Error('Access denied: Citizens cannot access the administrative dashboard.');
        }

        localStorage.setItem('gp_admin_token', userData.token);
        localStorage.setItem('gp_admin_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('gp_admin_token');
    localStorage.removeItem('gp_admin_user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
