// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('yt_user');
    const savedTokens = localStorage.getItem('yt_tokens');
    
    if (savedUser && savedTokens) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, tokens) => {
    setUser(userData);
    localStorage.setItem('yt_user', JSON.stringify(userData));
    localStorage.setItem('yt_tokens', JSON.stringify(tokens));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yt_user');
    localStorage.removeItem('yt_tokens');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
