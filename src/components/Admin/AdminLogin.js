import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import classes from './AdminLogin.module.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.loginCard}>
        <div className={classes.loginHeader}>
          <h1>Aloha Sorveteria</h1>
          <h2>Painel Administrativo</h2>
        </div>
        
        <form onSubmit={handleSubmit} className={classes.loginForm}>
          <div className={classes.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aloha.com"
              required
            />
          </div>

          <div className={classes.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className={classes.error}>{error}</div>}

          <button 
            type="submit" 
            className={classes.loginButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={classes.loginFooter}>
          <p>Acesso restrito ao administrador</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
