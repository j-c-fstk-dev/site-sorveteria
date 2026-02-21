
import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import classes from './CategoriasProdutos.module.css';
import Loading from '../Utility/Loading';

const CategoriasProdutos = () => {
  // Busca apenas as categorias que estão marcadas como ativas
  const { data: categorias, loading, error } = useApi('categorias', { ativo: 'eq.true', _sort: 'ordem' });

  const renderCategorias = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <li className={classes.error}>Erro ao carregar categorias.</li>;
    }

    if (categorias && categorias.length > 0) {
      return categorias.map(categoria => (
        <li key={categoria.id}>
          {/* O link levará para a página de produtos, futuramente podemos fazer um scroll até a categoria */}
          <Link to="/produtos">{categoria.nome}</Link>
        </li>
      ));
    }

    return <li>Nenhuma categoria encontrada.</li>;
  };

  return (
    <section className={classes.container}>
      <div className="container">
        <ul className={classes.listaCategorias}>
          {renderCategorias()}
        </ul>
      </div>
    </section>
  );
};

export default CategoriasProdutos;
