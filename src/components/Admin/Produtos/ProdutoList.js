import React, { useState, useMemo } from 'react';

import { Link } from 'react-router-dom';
import { useApi, useCrud } from '../../../hooks/useApi';
import classes from './ProdutoList.module.css';

const ProdutoList = () => {
  const { data: produtos, loading, error, refetch } = useApi('produtos');
  const { data: categorias } = useApi('categorias'); 
  const { delete: deleteProduto } = useCrud('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');

  const filteredProdutos = useMemo(() => {
    return produtos?.filter(produto => {
      const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria = !selectedCategoria || produto.categoria_id === selectedCategoria;
      return matchesSearch && matchesCategoria;
    }) || [];
  }, [produtos, searchTerm, selectedCategoria]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduto(id);
        refetch();
      } catch (error) {
        alert('Erro ao excluir produto: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className={classes.loading}>Carregando produtos...</div>;
  }

  if (error) {
    return <div className={classes.error}>Erro: {error}</div>;
  }

  return (
    <div className={classes.produtoList}>
      <div className={classes.header}>
        <h1>Produtos</h1>
        <Link to="/admin/produtos/novo" className={classes.addButton}>
          + Novo Produto
        </Link>
      </div>
      
      <div className={classes.filters}>
        <input 
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.searchInput}
        />
        <select 
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          className={classes.categorySelect}
        >
          <option value="">Todas as Categorias</option>
          {categorias?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
      </div>

      <table className={classes.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredProdutos.map(produto => {
            const categoriaNome = categorias?.find(c => c.id === produto.categoria_id)?.nome || 'N/A';
            return (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{categoriaNome}</td>
                <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                <td>{produto.ativo ? 'Ativo' : 'Inativo'}</td>
                <td className={classes.actions}>
                  <Link to={`/admin/produtos/editar/${produto.id}`} className={classes.editLink}>Editar</Link>
                  <button onClick={() => handleDelete(produto.id)} className={classes.deleteButton}>Excluir</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProdutoList;
