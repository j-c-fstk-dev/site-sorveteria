import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrud } from '../../../hooks/useApi';
import classes from './PromocaoForm.module.css';

const PromocaoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { create, update } = useCrud('promocoes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem_url: '',
    preco_promocional: '',
    preco_original: '',
    data_inicio: '',
    data_fim: '',
    ativa: 1,
    ordem: 0
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      // Carregar dados da promoção para edição
      // TODO: Implementar carga de dados da promoção
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        preco_promocional: formData.preco_promocional ? parseFloat(formData.preco_promocional) : null,
        preco_original: formData.preco_original ? parseFloat(formData.preco_original) : null,
        ordem: parseInt(formData.ordem) || 0
      };

      if (isEditing) {
        await update(id, data);
      } else {
        await create(data);
      }

      navigate('/admin/promocoes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.promocaoForm}>
      <div className={classes.header}>
        <h1>{isEditing ? 'Editar Promoção' : 'Nova Promoção'}</h1>
        <button 
          onClick={() => navigate('/admin/promocoes')}
          className={classes.cancelButton}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.formGrid}>
          <div className={classes.formGroup}>
            <label htmlFor="titulo">Título da Promoção *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="ordem">Ordem de Exibição</label>
            <input
              type="number"
              id="ordem"
              name="ordem"
              value={formData.ordem}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={4}
            placeholder="Descreva a promoção..."
          />
        </div>

        <div className={classes.formGrid}>
          <div className={classes.formGroup}>
            <label htmlFor="preco_original">Preço Original</label>
            <input
              type="number"
              id="preco_original"
              name="preco_original"
              value={formData.preco_original}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="preco_promocional">Preço Promocional</label>
            <input
              type="number"
              id="preco_promocional"
              name="preco_promocional"
              value={formData.preco_promocional}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className={classes.formGrid}>
          <div className={classes.formGroup}>
            <label htmlFor="data_inicio">Data de Início</label>
            <input
              type="date"
              id="data_inicio"
              name="data_inicio"
              value={formData.data_inicio}
              onChange={handleChange}
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="data_fim">Data de Término</label>
            <input
              type="date"
              id="data_fim"
              name="data_fim"
              value={formData.data_fim}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="imagem_url">URL da Imagem</label>
          <input
            type="url"
            id="imagem_url"
            name="imagem_url"
            value={formData.imagem_url}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className={classes.checkboxGroup}>
          <label className={classes.checkboxLabel}>
            <input
              type="checkbox"
              name="ativa"
              checked={formData.ativa === 1}
              onChange={handleChange}
            />
            Promoção Ativa
          </label>
        </div>

        {error && <div className={classes.error}>{error}</div>}

        <div className={classes.actions}>
          <button 
            type="submit" 
            className={classes.saveButton}
            disabled={loading}
          >
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromocaoForm;
