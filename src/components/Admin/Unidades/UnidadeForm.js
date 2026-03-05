import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi, useCrud } from '../../../hooks/useApi';
import classes from './UnidadeForm.module.css';

const UnidadeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { create, update } = useCrud('unidades');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formState, setFormState] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    uf: '',
    cep: '',
    telefone: '',
    mapa_url: '',
    ativo: true,
  });

  // Busca os dados da unidade se estiver editando
  const { data: unidadeData, loading: loadingUnidade } = useApi(id ? 'unidades' : null, { id: `eq.${id}` });

  useEffect(() => {
    if (id && unidadeData && unidadeData.length > 0) {
        setFormState(unidadeData[0]);
    }
  }, [id, unidadeData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await update(id, formState);
      } else {
        await create(formState);
      }
      navigate('/admin/unidades');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  if (id && loadingUnidade) {
      return <div>Carregando...</div>
  }

  return (
    <div className={classes.unidadeForm}>
      <h1>{id ? 'Editar Unidade' : 'Nova Unidade'}</h1>
      <form onSubmit={handleSubmit} className={classes.form}>
        
        <div className={classes.formGroup}>
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" name="nome" value={formState.nome} onChange={handleChange} required />
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="endereco">Endereço</label>
          <input type="text" id="endereco" name="endereco" value={formState.endereco} onChange={handleChange} />
        </div>

        <div className={classes.formGroupRow}>
          <div className={classes.formGroup}>
            <label htmlFor="cidade">Cidade</label>
            <input type="text" id="cidade" name="cidade" value={formState.cidade} onChange={handleChange} />
          </div>
          <div className={classes.formGroup} style={{width: '100px'}}>
            <label htmlFor="uf">UF</label>
            <input type="text" id="uf" name="uf" maxLength="2" value={formState.uf} onChange={handleChange} />
          </div>
        </div>

        <div className={classes.formGroupRow}>
            <div className={classes.formGroup}>
                <label htmlFor="cep">CEP</label>
                <input type="text" id="cep" name="cep" value={formState.cep} onChange={handleChange} />
            </div>
            <div className={classes.formGroup}>
                <label htmlFor="telefone">Telefone</label>
                <input type="text" id="telefone" name="telefone" value={formState.telefone} onChange={handleChange} />
            </div>
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="mapa_url">URL do Mapa (Google Maps)</label>
          <input type="url" id="mapa_url" name="mapa_url" value={formState.mapa_url} onChange={handleChange} />
        </div>

        <div className={`${classes.formGroup} ${classes.checkboxGroup}`}>
          <input type="checkbox" id="ativo" name="ativo" checked={formState.ativo} onChange={handleChange} />
          <label htmlFor="ativo">Unidade Ativa</label>
        </div>

        {error && <p className={classes.error}>{error}</p>}

        <div className={classes.actions}>
          <button type="submit" disabled={loading} className={classes.saveButton}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={() => navigate('/admin/unidades')} className={classes.cancelButton}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnidadeForm;
