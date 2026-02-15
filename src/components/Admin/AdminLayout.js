import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import classes from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/produtos', label: 'Produtos', icon: '🍦' },
    { path: '/admin/unidades', label: 'Unidades', icon: '📍' },
    { path: '/admin/promocoes', label: 'Promoções', icon: '🎉' },
    { path: '/admin/galeria', label: 'Galeria', icon: '🖼️' },
    { path: '/admin/configuracoes', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className={classes.adminLayout}>
      {/* Sidebar */}
      <div className={`${classes.sidebar} ${!sidebarOpen ? classes.sidebarClosed : ''}`}>
        <div className={classes.sidebarHeader}>
          <h2>Aloha Admin</h2>
          <button 
            className={classes.toggleButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className={classes.sidebarNav}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`${classes.navLink} ${
                    location.pathname === item.path ? classes.active : ''
                  }`}
                >
                  <span className={classes.navIcon}>{item.icon}</span>
                  {sidebarOpen && <span className={classes.navLabel}>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={classes.sidebarFooter}>
          <button onClick={handleLogout} className={classes.logoutButton}>
            <span className={classes.navIcon}>🚪</span>
            {sidebarOpen && <span className={classes.navLabel}>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={classes.mainContent}>
        <header className={classes.topBar}>
          <div className={classes.breadcrumb}>
            <span>Painel Administrativo</span>
            <span className={classes.separator}>/</span>
            <span>
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </span>
          </div>
          
          <div className={classes.userActions}>
            <Link to="/" className={classes.viewSiteButton} target="_blank">
              Ver Site →
            </Link>
          </div>
        </header>

        <main className={classes.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
