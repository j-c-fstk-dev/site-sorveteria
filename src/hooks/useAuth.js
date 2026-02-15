import { useState, useEffect } from 'react';

// Credenciais hardcoded para acesso admin
const ADMIN_CREDENTIALS = {
  email: 'admin@aloha.com',
  password: 'aloha123'
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já existe um token no localStorage
    const token = localStorage.getItem('admin_token');
    if (token === 'aloha_admin_authenticated') {
      setUser({ email: ADMIN_CREDENTIALS.email });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const userData = { email: ADMIN_CREDENTIALS.email };
      setUser(userData);
      localStorage.setItem('admin_token', 'aloha_admin_authenticated');
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      throw new Error('Email ou senha incorretos');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_token');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return { 
    user, 
    login, 
    logout, 
    loading, 
    isAuthenticated: isAuthenticated()
  };
}
