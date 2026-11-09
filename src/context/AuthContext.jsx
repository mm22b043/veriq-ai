import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('veriq_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    // Simple demo login — just store the email, derive initials cleanly
    const initials = email.slice(0, 2).toUpperCase();
    const newUser = {
      email,
      avatar: initials,
      role: 'Procurement Analyst',
    };
    setUser(newUser);
    localStorage.setItem('veriq_user', JSON.stringify(newUser));
    return true;
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
