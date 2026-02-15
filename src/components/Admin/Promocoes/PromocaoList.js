import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { useCrud } from '../../../hooks/useApi';
import classes from './PromocaoList.module.css';

const PromocaoList = () => {
  const { data: promocoes, loading, error, refetch } = useApi('promocoes');
  const { delete: deletePromocao, loading: deleting } = useCrud('promocoes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const filteredPromocoes = promocoes?.filter(promocao => {
    const matchesSearch = promocao.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || promocao.ativa;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta promoção?')) {
      try {
        await deletePromocao(id);
        refetch();
      } catch (error) {
        alert('Erro ao excluir promoção: ' + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isPromocaoValid = (dataInicio, dataFim) => {
    const hoje = new Date();
    const inicio = dataInicio ? new Date(dataInicio) : null;
    const fim = dataFim ? new Date(dataFim) : null;
    
    if (inicio && hoje < inicio) return { status: 'future', text: 'Inicia em breve' };
    if (fim && hoje > fim) return { status: 'expired', text: 'Encerrada' };
    return { status: 'active', text: 'Ativa' };
  };

  if (loading) {
    return <div className={classes.loading}>Carregando promoções...</div>;
  }

  if (error) {
    return <div className={classes.error}>Erro: {error}</div>;
  }

  return (
    <div className={classes.promocaoList}>
      <div className={classes.header}>
        <h1>Promoções</h1>
        <Link to="/admin/promocoes/nova" className={classes.addButton}>
          + Nova Promoção
        </Link>
      </div>

      <div className={classes.filters}>
        <input
          type="text"
          placeholder="Buscar promoções..."
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
        {filteredPromocoes.map((promocao) => {
          const status = isPromocaoValid(promocao.data_inicio, promocao.data_fim);
          
          return (
            <div key={promocao.id} className={classes.card}>
              <div className={classes.cardImage}>
                {promocao.imagem_url ? (
                  <img src={promocao.imagem_url} alt={promocao.titulo} />
                ) : (
                  <div className={classes.noImage}>🎉</div>
                )}
                
                <div className={`${classes.statusBadge} ${classes[status.status]}`}>
                  {status.text}
                </div>
              </div>
              
              <div className={classes.cardContent}>
                <h3>{promocao.titulo}</h3>
                <p className={classes.description}>{promocao.descricao}</p>
                
                <div className={classes.pricing}>
                  {promocao.preco_original && (
                    <span className={classes.originalPrice}>
                      R$ {promocao.preco_original.toFixed(2)}
                    </span>
                  )}
                  {promocao.preco_promocional && (
                    <span className={classes.promotionalPrice}>
                      R$ {promocao.preco_promocional.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className={classes.dates}>
                  {promocao.data_inicio && (
                    <span>De: {formatDate(promocao.data_inicio)}</span>
                  )}
                  {promocao.data_fim && (
                    <span>Até: {formatDate(promocao.data_fim)}</span>
                  )}
                </div>
                
                <div className={classes.badges}>
                  {promocao.ativa ? (
                    <span className={`${classes.badge} ${classes.active}`}>Ativa</span>
                  ) : (
                    <span className={`${classes.badge} ${classes.inactive}`}>Inativa</span>
                  )}
                </div>
              </div>
              
              <div className={classes.cardActions}>
                <Link 
                  to={`/admin/promocoes/editar/${promocao.id}`}
                  className={classes.editButton}
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(promocao.id)}
                  disabled={deleting}
                  className={classes.deleteButton}
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPromocoes.length === 0 && (
        <div className={classes.empty}>
          <p>Nenhuma promoção encontrada.</p>
          <Link to="/admin/promocoes/nova" className={classes.addButton}>
            Criar primeira promoção
          </Link>
        </div>
      )}
    </div>
  );
};

export default PromocaoList;
