import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('veriq_user');
      return stored ? JSON.parse(stored) : {
        name: 'Sarah Jenkins',
        email: 's.jenkins@zamp.ai',
        role: 'Lead Procurement Analyst',
        avatar: 'SJ'
      };
    } catch {
      return {
        name: 'Sarah Jenkins',
        email: 's.jenkins@zamp.ai',
        role: 'Lead Procurement Analyst',
        avatar: 'SJ'
      };
    }
  });

  const login = (email = 'analyst@veriq.ai', role = 'Procurement Lead') => {
    const newUser = {
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      avatar: email.slice(0, 2).toUpperCase()
    };
    setUser(newUser);
    localStorage.setItem('veriq_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('veriq_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

