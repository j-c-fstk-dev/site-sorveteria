import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { useCrud } from '../../../hooks/useApi';
import classes from './GaleriaList.module.css';

const GaleriaList = () => {
  const { data: galeria, loading, error, refetch } = useApi('galeria');
  const { delete: deleteItem, loading: deleting } = useCrud('galeria');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const filteredItems = galeria?.filter(item => {
    const matchesSearch = item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || item.ativa;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta foto?')) {
      try {
        await deleteItem(id);
        refetch();
      } catch (error) {
        alert('Erro ao excluir foto: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className={classes.loading}>Carregando galeria...</div>;
  }

  if (error) {
    return <div className={classes.error}>Erro: {error}</div>;
  }

  return (
    <div className={classes.galeriaList}>
      <div className={classes.header}>
        <h1>Galeria</h1>
        <Link to="/admin/galeria/nova" className={classes.addButton}>
          + Nova Foto
        </Link>
      </div>

      <div className={classes.filters}>
        <input
          type="text"
          placeholder="Buscar fotos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.searchInput}
        />
        
        <label className={classes.checkboxLabel}>
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          Mostrar inativas
        </label>
      </div>

      <div className={classes.grid}>
        {filteredItems.map((item) => (
          <div key={item.id} className={classes.card}>
            <div className={classes.cardImage}>
              {item.imagem_url ? (
                <img src={item.imagem_url} alt={item.titulo || 'Foto da galeria'} />
              ) : (
                <div className={classes.noImage}>🖼️</div>
              )}
              
              {!item.ativa && (
                <div className={classes.inactiveOverlay}>
                  <span>Inativa</span>
                </div>
              )}
            </div>
            
            <div className={classes.cardContent}>
              <h3>{item.titulo || 'Sem título'}</h3>
              {item.descricao && (
                <p className={classes.description}>{item.descricao}</p>
              )}
              
              <div className={classes.metadata}>
                <span className={classes.order}>Ordem: {item.ordem}</span>
                <span className={`${classes.status} ${item.ativa ? classes.active : classes.inactive}`}>
                  {item.ativa ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>
            
            <div className={classes.cardActions}>
              <Link 
                to={`/admin/galeria/editar/${item.id}`}
                className={classes.editButton}
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleting}
                className={classes.deleteButton}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className={classes.empty}>
          <p>Nenhuma foto encontrada na galeria.</p>
          <Link to="/admin/galeria/nova" className={classes.addButton}>
            Adicionar primeira foto
          </Link>
        </div>
      )}
    </div>
  );
};

export default GaleriaList;
