import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { useCrud } from '../../../hooks/useApi';
import classes from './UnidadeList.module.css';

const UnidadeList = () => {
  const { data: unidades, loading, error, refetch } = useApi('unidades');
  const { delete: deleteUnidade, loading: deleting } = useCrud('unidades');

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        await deleteUnidade(id);
        refetch();
      } catch (error) {
        alert('Erro ao excluir unidade: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className={classes.loading}>Carregando unidades...</div>;
  }

  if (error) {
    return <div className={classes.error}>Erro: {error}</div>;
  }

  return (
    <div className={classes.unidadeList}>
      <div className={classes.header}>
        <h1>Unidades</h1>
        <Link to="/admin/unidades/nova" className={classes.addButton}>
          + Nova Unidade
        </Link>
      </div>

      <div className={classes.grid}>
        {unidades?.map((unidade) => (
          <div key={unidade.id} className={classes.card}>
            <div className={classes.cardHeader}>
              <h3>{unidade.nome}</h3>
              <span className={`${classes.typeBadge} ${classes[unidade.tipo]}`}>
                {unidade.tipo === 'matriz' ? 'Matriz' : 'Express'}
              </span>
            </div>
            
            <div className={classes.cardContent}>
              <div className={classes.infoRow}>
                <span className={classes.label}>Endereço:</span>
                <span className={classes.value}>
                  {unidade.endereco}, {unidade.bairro}
                </span>
              </div>
              
              <div className={classes.infoRow}>
                <span className={classes.label}>Cidade/UF:</span>
                <span className={classes.value}>
                  {unidade.cidade}/{unidade.estado}
                </span>
              </div>
              
              <div className={classes.infoRow}>
                <span className={classes.label}>CEP:</span>
                <span className={classes.value}>{unidade.cep}</span>
              </div>
              
              <div className={classes.infoRow}>
                <span className={classes.label}>Telefone:</span>
                <span className={classes.value}>{unidade.telefone}</span>
              </div>
              
              <div className={classes.infoRow}>
                <span className={classes.label}>Horário:</span>
                <span className={classes.value}>
                  {unidade.horario_funcionamento.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < unidade.horario_funcionamento.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
              
              {unidade.descricao && (
                <div className={classes.description}>
                  <span className={classes.label}>Descrição:</span>
                  <p>{unidade.descricao}</p>
                </div>
              )}
            </div>
            
            <div className={classes.cardActions}>
              <Link 
                to={`/admin/unidades/editar/${unidade.id}`}
                className={classes.editButton}
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(unidade.id)}
                disabled={deleting}
                className={classes.deleteButton}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {unidades?.length === 0 && (
        <div className={classes.empty}>
          <p>Nenhuma unidade encontrada.</p>
          <Link to="/admin/unidades/nova" className={classes.addButton}>
            Criar primeira unidade
          </Link>
        </div>
      )}
    </div>
  );
};

export default UnidadeList;
