import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { useCrud } from '../../../hooks/useApi';
import classes from './ProdutoList.module.css';

const ProdutoList = () => {
  const { data: produtos, loading, error, refetch } = useApi('produtos');
  const { delete: deleteProduto, loading: deleting } = useCrud('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');

  const filteredProdutos = produtos?.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !selectedCategoria || produto.categoria_id == selectedCategoria;
    return matchesSearch && matchesCategoria;
  }) || [];

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
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.searchInput}
        />
        
        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          className={classes.categoryFilter}
        >
          <option value="">Todas as categorias</option>
          <option value="1">Sorvetes de Massa</option>
          <option value="2">Picolés</option>
          <option value="3">Especiais</option>
          <option value="4">Açaí</option>
        </select>
      </div>

      <div className={classes.grid}>
        {filteredProdutos.map((produto) => (
          <div key={produto.id} className={classes.card}>
            <div className={classes.cardImage}>
              {produto.imagem_url ? (
                <img src={produto.imagem_url} alt={produto.nome} />
              ) : (
                <div className={classes.noImage}>🍦</div>
              )}
            </div>
            
            <div className={classes.cardContent}>
              <h3>{produto.nome}</h3>
              <p className={classes.description}>{produto.descricao}</p>
              
              {produto.preco && (
                <p className={classes.price}>R$ {produto.preco.toFixed(2)}</p>
              )}
              
              <div className={classes.badges}>
                {produto.destaque && (
                  <span className={classes.badge}>Destaque</span>
                )}
                {produto.ativo || (
                  <span className={`${classes.badge} ${classes.inactive}`}>Inativo</span>
                )}
              </div>
            </div>
            
            <div className={classes.cardActions}>
              <Link 
                to={`/admin/produtos/editar/${produto.id}`}
                className={classes.editButton}
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(produto.id)}
                disabled={deleting}
                className={classes.deleteButton}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <div className={classes.empty}>
          <p>Nenhum produto encontrado.</p>
          <Link to="/admin/produtos/novo" className={classes.addButton}>
            Criar primeiro produto
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProdutoList;
