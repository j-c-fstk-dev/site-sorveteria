
import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import classes from './MaisVendidos.module.css';
import Loading from '../Utility/Loading';

const Slider = lazy(() => import('../Utility/Slider'));

const MaisVendidos = () => {
  // Busca produtos que são 'destaque' e 'ativos' do banco de dados
  const { data: maisVendidos, loading, error } = useApi('produtos', {
    destaque: 'eq.true', 
    ativo: 'eq.true',
    _limit: 10 // Limita a 10 produtos para não sobrecarregar a home
  });

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <p className={classes.error}>Não foi possível carregar os mais vendidos.</p>;
    }

    if (maisVendidos && maisVendidos.length > 0) {
      return <Slider items={maisVendidos} />;
    }

    return <p>Nenhum produto em destaque no momento.</p>;
  };

  return (
    <section className={classes.container}>
      <div className='container'>
        <h2>Mais vendidos</h2>
        <p>Os mais pedidos da semana!</p>
        <Suspense fallback={<Loading />}>
          {renderContent()}
        </Suspense>
        <Link to="/produtos" className='btn-amarelo'>Confira todos os produtos</Link>
      </div>
    </section>
  );
};

export default MaisVendidos;
