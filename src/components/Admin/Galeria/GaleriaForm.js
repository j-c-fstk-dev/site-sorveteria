import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrud } from '../../../hooks/useApi';
import classes from './GaleriaForm.module.css';

const GaleriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { create, update } = useCrud('galeria');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem_url: '',
    ordem: 0,
    ativa: 1
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      // Carregar dados da foto para edição
      // TODO: Implementar carga de dados da foto
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
        ordem: parseInt(formData.ordem) || 0
      };

      if (isEditing) {
        await update(id, data);
      } else {
        await create(data);
      }

      navigate('/admin/galeria');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.galeriaForm}>
      <div className={classes.header}>
        <h1>{isEditing ? 'Editar Foto' : 'Nova Foto'}</h1>
        <button 
          onClick={() => navigate('/admin/galeria')}
          className={classes.cancelButton}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.formGrid}>
          <div className={classes.formGroup}>
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Título da foto"
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
            placeholder="Descreva a foto..."
          />
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="imagem_url">URL da Imagem *</label>
          <input
            type="url"
            id="imagem_url"
            name="imagem_url"
            value={formData.imagem_url}
            onChange={handleChange}
            required
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        {formData.imagem_url && (
          <div className={classes.imagePreview}>
            <label>Preview da Imagem:</label>
            <div className={classes.previewContainer}>
              <img 
                src={formData.imagem_url} 
                alt="Preview" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className={classes.previewError} style={{ display: 'none' }}>
                <span>⚠️ Não foi possível carregar a imagem</span>
              </div>
            </div>
          </div>
        )}

        <div className={classes.checkboxGroup}>
          <label className={classes.checkboxLabel}>
            <input
              type="checkbox"
              name="ativa"
              checked={formData.ativa === 1}
              onChange={handleChange}
            />
            Foto Ativa
          </label>
        </div>

        {error && <div className={classes.error}>{error}</div>}

        <div className={classes.actions}>
          <button 
            type="submit" 
            className={classes.saveButton}
            disabled={loading}
          >
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GaleriaForm;
