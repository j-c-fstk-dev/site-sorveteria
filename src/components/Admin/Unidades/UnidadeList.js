import React from 'react';
import { Link } from 'react-router-dom';
import { useApi, useCrud } from '../../../hooks/useApi';
import classes from './UnidadeList.module.css';

const UnidadeList = () => {
  const { data: unidades, loading, error, refetch } = useApi('unidades');
  const { delete: deleteUnidade } = useCrud('unidades');

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      await deleteUnidade(id);
      refetch();
    }
  };

  if (loading) return <p>Carregando unidades...</p>;
  if (error) return <p>Erro ao carregar unidades: {error}</p>;

  return (
    <div className={classes.unidadeList}>
      <div className={classes.header}>
        <h1>Unidades</h1>
        <Link to="/admin/unidades/nova" className={classes.addButton}>+ Nova Unidade</Link>
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cidade</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {unidades.map(unidade => (
            <tr key={unidade.id}>
              <td>{unidade.nome}</td>
              <td>{unidade.cidade}</td>
              <td>{unidade.telefone}</td>
              <td>{unidade.ativo ? 'Ativa' : 'Inativa'}</td>
              <td className={classes.actions}>
                <Link to={`/admin/unidades/editar/${unidade.id}`} className={classes.editLink}>Editar</Link>
                <button onClick={() => handleDelete(unidade.id)} className={classes.deleteButton}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnidadeList;
