import React from 'react';
import { useApi } from '../../hooks/useApi';
import classes from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { data: produtos } = useApi('produtos');
  const { data: unidades } = useApi('unidades');
  const { data: promocoes } = useApi('promocoes');
  const { data: galeria } = useApi('galeria');
  const { data: empresa } = useApi('empresas');

  const statsCards = [
    {
      title: 'Produtos',
      count: produtos?.length || 0,
      icon: '🍦',
      color: '#3498db',
      link: '/admin/produtos'
    },
    {
      title: 'Unidades',
      count: unidades?.length || 0,
      icon: '📍',
      color: '#2ecc71',
      link: '/admin/unidades'
    },
    {
      title: 'Promoções Ativas',
      count: promocoes?.filter(p => p.ativa).length || 0,
      icon: '🎉',
      color: '#e74c3c',
      link: '/admin/promocoes'
    },
    {
      title: 'Fotos na Galeria',
      count: galeria?.length || 0,
      icon: '🖼️',
      color: '#f39c12',
      link: '/admin/galeria'
    }
  ];

  const recentActivity = [
    { type: 'produto', action: 'Novo produto adicionado', name: 'Sorvete de Nozes', time: '2 horas atrás' },
    { type: 'promocao', action: 'Promoção atualizada', name: 'Felicize seu dia', time: '5 horas atrás' },
    { type: 'unidade', action: 'Horário modificado', name: 'Aloha Express', time: '1 dia atrás' },
    { type: 'galeria', action: 'Nova foto adicionada', name: 'Galeria Principal', time: '2 dias atrás' }
  ];

  const quickActions = [
    { title: 'Novo Produto', description: 'Adicionar novo produto ao cardápio', icon: '➕', link: '/admin/produtos/novo' },
    { title: 'Nova Promoção', description: 'Criar promoção especial', icon: '🎁', link: '/admin/promocoes/nova' },
    { title: 'Nova Foto', description: 'Adicionar foto à galeria', icon: '📷', link: '/admin/galeria/nova' },
    { title: 'Configurações', description: 'Ajustar configurações do site', icon: '⚙️', link: '/admin/configuracoes' }
  ];

  return (
    <div className={classes.dashboard}>
      <div className={classes.dashboardHeader}>
        <h1>Dashboard</h1>
        <p>Bem-vindo ao painel administrativo da Aloha Sorveteria</p>
      </div>

      {/* Stats Cards */}
      <div className={classes.statsGrid}>
        {statsCards.map((stat, index) => (
          <div key={index} className={classes.statCard}>
            <div className={classes.statIcon} style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className={classes.statContent}>
              <h3>{stat.count}</h3>
              <p>{stat.title}</p>
            </div>
            <a href={stat.link} className={classes.statLink}>
              Ver →
            </a>
          </div>
        ))}
      </div>

      <div className={classes.dashboardGrid}>
        {/* Recent Activity */}
        <div className={classes.dashboardCard}>
          <h2>Atividade Recente</h2>
          <div className={classes.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={classes.activityItem}>
                <div className={classes.activityIcon}>
                  {activity.type === 'produto' && '🍦'}
                  {activity.type === 'promocao' && '🎉'}
                  {activity.type === 'unidade' && '📍'}
                  {activity.type === 'galeria' && '🖼️'}
                </div>
                <div className={classes.activityContent}>
                  <p className={classes.activityAction}>{activity.action}</p>
                  <p className={classes.activityName}>{activity.name}</p>
                  <p className={classes.activityTime}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={classes.dashboardCard}>
          <h2>Ações Rápidas</h2>
          <div className={classes.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <a key={index} href={action.link} className={classes.quickActionCard}>
                <div className={classes.quickActionIcon}>{action.icon}</div>
                <div className={classes.quickActionContent}>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Company Info */}
      {empresa && empresa[0] && (
        <div className={classes.dashboardCard}>
          <h2>Informações da Empresa</h2>
          <div className={classes.companyInfo}>
            <div className={classes.infoRow}>
              <span className={classes.infoLabel}>Nome Fantasia:</span>
              <span className={classes.infoValue}>{empresa[0].nome_fantasia}</span>
            </div>
            <div className={classes.infoRow}>
              <span className={classes.infoLabel}>Razão Social:</span>
              <span className={classes.infoValue}>{empresa[0].razao_social}</span>
            </div>
            <div className={classes.infoRow}>
              <span className={classes.infoLabel}>WhatsApp:</span>
              <span className={classes.infoValue}>{empresa[0].whatsapp}</span>
            </div>
            <div className={classes.infoRow}>
              <span className={classes.infoLabel}>Instagram:</span>
              <span className={classes.infoValue}>{empresa[0].instagram}</span>
            </div>
            <div className={classes.infoRow}>
              <span className={classes.infoLabel}>Email:</span>
              <span className={classes.infoValue}>{empresa[0].email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
