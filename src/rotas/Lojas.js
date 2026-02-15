import React, { useEffect } from 'react';
import Head from '../components/Utility/Head';
import LayoutRotas from '../components/Utility/LayoutRotas';
import { useApi } from '../hooks/useApi';
import classes from './Lojas.module.css';

const Lojas = () => {
  const { data: unidades, loading, error } = useApi('unidades');

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <LayoutRotas titulo='Carregando...' descricao=''>
        <Head title='Lojas' description='Carregando lojas...' />
        <div className={classes.loading}>Carregando informações das lojas...</div>
      </LayoutRotas>
    );
  }

  if (error) {
    return (
      <LayoutRotas titulo='Erro' descricao='Não foi possível carregar as lojas'>
        <Head title='Erro - Lojas' description='Erro ao carregar lojas' />
        <div className={classes.error}>Ocorreu um erro ao carregar as informações das lojas.</div>
      </LayoutRotas>
    );
  }

  return (
    <LayoutRotas titulo='Encontre a loja mais perto de você!' descricao='Aloha Sorveteria: Sorvetes artesanais com leite fresco da fazenda'>
      <Head title='Lojas - Aloha Sorveteria' description='Encontre a unidade Aloha Sorveteria mais perto de você em Pindamonhangaba' />
      <ul className={classes.listaLojas}>
        {unidades?.map((unidade) => (
          <li key={unidade.id}>
            <h2>{unidade.nome}</h2>
            <span>{unidade.endereco}</span>
            <span>{unidade.bairro} - {unidade.cidade}/{unidade.estado}</span>
            <span>CEP: {unidade.cep}</span>
            <span>Telefone: {unidade.telefone}</span>
            <div className={classes.horario}>
              <strong>Horário de Funcionamento:</strong>
              <span>{unidade.horario_funcionamento.split('\n').map((linha, index) => (
                <span key={index}>
                  {linha}
                  {index < unidade.horario_funcionamento.split('\n').length - 1 && <br />}
                </span>
              ))}</span>
            </div>
            {unidade.descricao && (
              <div className={classes.descricao}>
                <strong>Informações:</strong>
                <span>{unidade.descricao}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </LayoutRotas>
  )
}

export default Lojas