import React, { useEffect } from 'react'
import LayoutRotas from '../components/Utility/LayoutRotas';
import Slider from '../components/Utility/Slider';
import classes from './Produtos.module.css';
import { useApi } from '../hooks/useApi';
import Head from '../components/Utility/Head';

const Produtos = () => {
  const { data: produtos, loading, error } = useApi('produtos', { ativo: 1 });
  const { data: categorias } = useApi('categorias', { ativa: 1 });

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <LayoutRotas titulo='Carregando...' descricao=''>
        <Head title='Produtos' description='Carregando produtos...' />
        <div className={classes.loading}>Carregando produtos...</div>
      </LayoutRotas>
    );
  }

  if (error) {
    return (
      <LayoutRotas titulo='Erro' descricao='Não foi possível carregar os produtos'>
        <Head title='Erro - Produtos' description='Erro ao carregar produtos' />
        <div className={classes.error}>Ocorreu um erro ao carregar os produtos.</div>
      </LayoutRotas>
    );
  }

  // Agrupar produtos por categoria
  const produtosPorCategoria = categorias?.map(categoria => ({
    categoria,
    produtos: produtos?.filter(produto => produto.categoria_id === categoria.id) || []
  }));

  return (
    <LayoutRotas titulo='Nossos Produtos!' descricao='Sorvetes artesanais feitos com leite fresco da fazenda'>
      <Head title='Produtos - Aloha Sorveteria' description='Conheça nossos sorvetes artesanais, picolés e especiais' />
      <div className={classes.produtos}>
        {produtosPorCategoria?.map(({ categoria, produtos: produtosCategoria }) => (
          produtosCategoria.length > 0 && (
            <section key={categoria.id}>
              <h2>{categoria.nome}</h2>
              <p className={classes.categoriaDescricao}>{categoria.descricao}</p>
              <Slider 
                items={produtosCategoria}
                colorsBtn={{
                  backgroundColor: categoria.id === 1 ? '#FBEE7C' : 
                                 categoria.id === 2 ? '#53D6CE' :
                                 categoria.id === 3 ? '#F5F5F5' : '#E8B4F3',
                  color: categoria.id === 1 ? '#5f581d' : 
                         categoria.id === 2 ? '#1c5753' :
                         categoria.id === 3 ? 'grey' : '#8B4513'
                }}
              />
            </section>
          )
        ))}
      </div>
    </LayoutRotas>
  )
}

export default Produtos