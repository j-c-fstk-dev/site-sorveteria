
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { useCrud } from '../../../hooks/useApi'; // Certifique-se que useCrud está sendo exportado corretamente de useApi
import classes from './ProdutoForm.module.css';

const ProdutoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: produtoParaEdicao, loading: loadingProduto } = useApi(id ? `produtos/${id}` : null);
  const { data: categorias } = useApi('categorias', { ativa: 1, _sort: 'nome' });
  const { create, update } = useCrud('produtos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria_id: '',
    imagem_url: '',
    destaque: false,       // Booleano
    ativo: true,         // Booleano, padrão para true
    ordem: 0,
    is_zero_lactose: false, // Novo campo booleano
    is_diet: false          // Novo campo booleano
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    // Se estiver editando e o produto for carregado, atualize o formulário
    if (isEditing && produtoParaEdicao) {
      setFormData({
        nome: produtoParaEdicao.nome || '',
        descricao: produtoParaEdicao.descricao || '',
        preco: produtoParaEdicao.preco || '',
        categoria_id: produtoParaEdicao.categoria_id || '',
        imagem_url: produtoParaEdicao.imagem_url || '',
        destaque: produtoParaEdicao.destaque || false,
        ativo: produtoParaEdicao.ativo === null ? true : produtoParaEdicao.ativo,
        ordem: produtoParaEdicao.ordem || 0,
        is_zero_lactose: produtoParaEdicao.is_zero_lactose || false,
        is_diet: produtoParaEdicao.is_diet || false,
      });
    }
  }, [id, isEditing, produtoParaEdicao]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Garante que os valores numéricos e de categoria sejam tratados corretamente
      const data = {
        ...formData,
        preco: formData.preco ? parseFloat(formData.preco) : null,
        ordem: parseInt(formData.ordem) || 0,
        categoria_id: parseInt(formData.categoria_id) || null,
      };

      if (isEditing) {
        await update(id, data);
      } else {
        await create(data);
      }

      navigate('/admin/produtos');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao salvar o produto.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduto) return <p>Carregando produto...</p>;

  return (
    <div className={classes.produtoForm}>
      <div className={classes.header}>
        <h1>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
        <button onClick={() => navigate('/admin/produtos')} className={classes.cancelButton}>Cancelar</button>
      </div>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.formGrid}>
          {/* Campos existentes como Nome, Categoria, Preço, Ordem... */}
          <div className={classes.formGroup}><label htmlFor="nome">Nome *</label><input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required /></div>
          <div className={classes.formGroup}><label htmlFor="categoria_id">Categoria *</label><select id="categoria_id" name="categoria_id" value={formData.categoria_id} onChange={handleChange} required><option value="">Selecione...</option>{categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
          <div className={classes.formGroup}><label htmlFor="preco">Preço</label><input type="number" id="preco" name="preco" value={formData.preco} onChange={handleChange} step="0.01" min="0" placeholder="0.00" /></div>
          <div className={classes.formGroup}><label htmlFor="ordem">Ordem</label><input type="number" id="ordem" name="ordem" value={formData.ordem} onChange={handleChange} min="0" /></div>
        </div>

        <div className={classes.formGroup}><label htmlFor="descricao">Descrição</label><textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows={4} /></div>
        <div className={classes.formGroup}><label htmlFor="imagem_url">URL da Imagem</label><input type="url" id="imagem_url" name="imagem_url" value={formData.imagem_url} onChange={handleChange} placeholder="https://ex..." /></div>

        {/* GRUPO DE CHECKBOXES ATUALIZADO */}
        <div className={classes.checkboxContainer}>
          <label className={classes.checkboxLabel}><input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleChange} /> Ativo</label>
          <label className={classes.checkboxLabel}><input type="checkbox" name="destaque" checked={formData.destaque} onChange={handleChange} /> Destaque</label>
          <label className={classes.checkboxLabel}><input type="checkbox" name="is_zero_lactose" checked={formData.is_zero_lactose} onChange={handleChange} /> 0% Lactose</label>
          <label className={classes.checkboxLabel}><input type="checkbox" name="is_diet" checked={formData.is_diet} onChange={handleChange} /> 0% Açúcar (Diet)</label>
        </div>

        {error && <div className={classes.error}>{error}</div>}

        <div className={classes.actions}>
          <button type="submit" className={classes.saveButton} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProdutoForm;
