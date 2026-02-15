import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { useCrud } from '../../../hooks/useApi';
import classes from './ProdutoForm.module.css';

const ProdutoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: categorias } = useApi('categorias', { ativa: 1 });
  const { create, update } = useCrud('produtos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria_id: '',
    imagem_url: '',
    destaque: 0,
    ordem: 0,
    ativo: 1
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      // Carregar dados do produto para edição
      // TODO: Implementar carga de dados do produto
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
        preco: formData.preco ? parseFloat(formData.preco) : null,
        ordem: parseInt(formData.ordem) || 0
      };

      if (isEditing) {
        await update(id, data);
      } else {
        await create(data);
      }

      navigate('/admin/produtos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.produtoForm}>
      <div className={classes.header}>
        <h1>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
        <button 
          onClick={() => navigate('/admin/produtos')}
          className={classes.cancelButton}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.formGrid}>
          <div className={classes.formGroup}>
            <label htmlFor="nome">Nome do Produto *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="categoria_id">Categoria *</label>
            <select
              id="categoria_id"
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias?.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="preco">Preço</label>
            <input
              type="number"
              id="preco"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
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
            placeholder="Descreva o produto..."
          />
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
              name="destaque"
              checked={formData.destaque === 1}
              onChange={handleChange}
            />
            Produto em Destaque
          </label>

          <label className={classes.checkboxLabel}>
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo === 1}
              onChange={handleChange}
            />
            Produto Ativo
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

export default ProdutoForm;
