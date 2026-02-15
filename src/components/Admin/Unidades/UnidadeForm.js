import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { useCrud } from '../../../hooks/useApi';
import classes from './UnidadeForm.module.css';

const UnidadeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: empresas } = useApi('empresas');
  const { create, update } = useCrud('unidades');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    empresa_id: 1,
    nome: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    cep: '',
    telefone: '',
    horario_funcionamento: '',
    descricao: '',
    tipo: 'matriz'
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      // Carregar dados da unidade para edição
      // TODO: Implementar carga de dados da unidade
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        empresa_id: parseInt(formData.empresa_id)
      };

      if (isEditing) {
        await update(id, data);
      } else {
        await create(data);
      }

      navigate('/admin/unidades');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.unidadeForm}>
      <div className={classes.header}>
        <h1>{isEditing ? 'Editar Unidade' : 'Nova Unidade'}</h1>
        <button 
          onClick={() => navigate('/admin/unidades')}
          className={classes.cancelButton}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.section}>
          <h2>Informações Básicas</h2>
          
          <div className={classes.formGrid}>
            <div className={classes.formGroup}>
              <label htmlFor="nome">Nome da Unidade *</label>
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
              <label htmlFor="tipo">Tipo *</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="matriz">Matriz</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>
        </div>

        <div className={classes.section}>
          <h2>Endereço</h2>
          
          <div className={classes.formGrid}>
            <div className={`${classes.formGroup} ${classes.fullWidth}`}>
              <label htmlFor="endereco">Endereço *</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="bairro">Bairro</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="cidade">Cidade *</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
                <option value="BA">BA</option>
              </select>
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="00000-000"
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </div>

        <div className={classes.section}>
          <h2>Funcionamento</h2>
          
          <div className={classes.formGroup}>
            <label htmlFor="horario_funcionamento">Horário de Funcionamento</label>
            <textarea
              id="horario_funcionamento"
              name="horario_funcionamento"
              value={formData.horario_funcionamento}
              onChange={handleChange}
              rows={4}
              placeholder="Segunda a sexta: 11h às 21h&#10;Sábado e domingo: 10h às 21h"
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={4}
              placeholder="Informações adicionais sobre a unidade..."
            />
          </div>
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

export default UnidadeForm;
