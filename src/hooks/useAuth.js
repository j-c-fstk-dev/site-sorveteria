import { useState, useEffect } from 'react';

const ADMIN_CREDENTIALS = {
  email: 'admin@aloha.com.br',
  password: 'aloha123'
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token === 'authenticated') {
      setUser({ email: ADMIN_CREDENTIALS.email });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('admin_token', 'authenticated');
      setUser({ email: ADMIN_CREDENTIALS.email });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };
}
