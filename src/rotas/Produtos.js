
import React, { useEffect, useMemo } from 'react';
import LayoutRotas from '../components/Utility/LayoutRotas';
import Slider from '../components/Utility/Slider';
import classes from './Produtos.module.css';
import { useApi } from '../hooks/useApi';
import Head from '../components/Utility/Head';

const Produtos = () => {
  // Correção: Usa a sintaxe 'eq.true' para filtros booleanos no Supabase
  const { data: produtos, loading: loadingProdutos, error: errorProdutos } = useApi('produtos', { ativo: 'eq.true', _sort: 'ordem' });
  const { data: categorias, loading: loadingCategorias, error: errorCategorias } = useApi('categorias', { ativa: 'eq.true', _sort: 'ordem' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const produtosPorCategoria = useMemo(() => {
    if (!categorias || !produtos) {
      return [];
    }
    return categorias.map(categoria => ({
      ...categoria,
      produtos: produtos.filter(produto => produto.categoria_id === categoria.id)
    })).filter(categoria => categoria.produtos.length > 0);
  }, [categorias, produtos]);

  const isLoading = loadingProdutos || loadingCategorias;
  const hasError = errorProdutos || errorCategorias;

  if (isLoading) {
    return (
      <LayoutRotas titulo='Carregando...' descricao=''>
        <Head title='Produtos' description='Carregando nosso cardápio...' />
        <div className={classes.loading}>Carregando produtos...</div>
      </LayoutRotas>
    );
  }

  if (hasError) {
    return (
      <LayoutRotas titulo='Ops! Algo deu errado' descricao='Não foi possível carregar os produtos'>
        <Head title='Erro - Produtos' description='Erro ao carregar produtos' />
        <div className={classes.error}>Ocorreu um erro ao buscar nosso cardápio. Por favor, tente novamente mais tarde.</div>
      </LayoutRotas>
    );
  }

  return (
    <LayoutRotas titulo='Nossos Produtos!' descricao='Sorvetes artesanais feitos com leite fresco da fazenda'>
      <Head title='Produtos - Aloha Sorveteria' description='Conheça nossos sorvetes artesanais, picolés e especiais' />
      <div className={classes.produtos}>
        {produtosPorCategoria.map((categoria) => (
          <section key={categoria.id}>
            <h2>{categoria.nome}</h2>
            <p className={classes.categoriaDescricao}>{categoria.descricao}</p>
            <Slider 
              items={categoria.produtos}
              colorsBtn={{
                backgroundColor: categoria.cor_fundo || '#E8B4F3',
                color: categoria.cor_texto || '#8B4513'
              }}
            />
          </section>
        ))}

        {produtosPorCategoria.length === 0 && !isLoading && (
          <p>Nenhum produto encontrado. Cadastre novos itens no painel de administração para vê-los aqui!</p>
        )}
      </div>
    </LayoutRotas>
  );
};

export default Produtos;
