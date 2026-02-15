import React, { useEffect } from 'react';
import Head from '../components/Utility/Head';
import LayoutRotas from '../components/Utility/LayoutRotas';
import { useApi } from '../hooks/useApi';
import classes from './Galeria.module.css';

const Galeria = () => {
  const { data: galeria, loading, error } = useApi('galeria', { ativa: 1 });

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <LayoutRotas titulo='Carregando...' descricao=''>
        <Head title='Galeria' description='Carregando galeria...' />
        <div className={classes.loading}>Carregando galeria...</div>
      </LayoutRotas>
    );
  }

  if (error) {
    return (
      <LayoutRotas titulo='Erro' descricao='Não foi possível carregar a galeria'>
        <Head title='Erro - Galeria' description='Erro ao carregar galeria' />
        <div className={classes.error}>Ocorreu um erro ao carregar a galeria.</div>
      </LayoutRotas>
    );
  }

  return (
    <LayoutRotas titulo='Nossa Galeria!' descricao='Conheça o ambiente tropical e familiar da Aloha Sorveteria'>
      <Head title='Galeria - Aloha Sorveteria' description='Veja fotos da Aloha Sorveteria em Pindamonhangaba' />
      <div className={classes.galeria}>
        {galeria?.map((item, index) => (
          <div key={item.id} className={classes.item}>
            <img 
              src={item.imagem_url} 
              alt={item.titulo || `Foto ${index + 1} da galeria`}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53Lm9yZy8yMDAwL3N2ZyI+DQo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiPjwvc3ZnPg==';
              }}
            />
            {item.titulo && (
              <div className={classes.overlay}>
                <h3>{item.titulo}</h3>
                {item.descricao && <p>{item.descricao}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </LayoutRotas>
  )
}

export default Galeria;
