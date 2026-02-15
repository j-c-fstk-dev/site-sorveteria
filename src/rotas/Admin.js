import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminLogin from '../components/Admin/AdminLogin';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminLayout from '../components/Admin/AdminLayout';
import AdminProdutos from '../components/Admin/Produtos/AdminProdutos';
import AdminUnidades from '../components/Admin/Unidades/AdminUnidades';
import AdminPromocoes from '../components/Admin/Promocoes/AdminPromocoes';
import AdminGaleria from '../components/Admin/Galeria/AdminGaleria';
import AdminConfiguracoes from '../components/Admin/Configuracoes/AdminConfiguracoes';
import Head from '../components/Utility/Head';

const Admin = () => {
  const { isAuthenticated, loading } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Pequeno delay para verificar autenticação
    const timer = setTimeout(() => {
      setCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading || checkingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head title='Admin Login' description='Painel Administrativo Aloha Sorveteria' />
        <AdminLogin />
      </>
    );
  }

  return (
    <>
      <Head title='Painel Admin' description='Painel Administrativo Aloha Sorveteria' />
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/produtos/*" element={<AdminProdutos />} />
          <Route path="/unidades/*" element={<AdminUnidades />} />
          <Route path="/promocoes/*" element={<AdminPromocoes />} />
          <Route path="/galeria/*" element={<AdminGaleria />} />
          <Route path="/configuracoes" element={<AdminConfiguracoes />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </>
  );
};

export default Admin;
