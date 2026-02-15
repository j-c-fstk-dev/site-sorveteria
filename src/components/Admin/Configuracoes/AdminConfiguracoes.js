import React from 'react';
import { useApi } from '../../../hooks/useApi';
import { useCrud } from '../../../hooks/useApi';
import classes from './AdminConfiguracoes.module.css';

const AdminConfiguracoes = () => {
  const { data: empresa, loading, error, refetch } = useApi('empresas');
  const { update } = useCrud('empresas');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      nome_fantasia: formData.get('nome_fantasia'),
      razao_social: formData.get('razao_social'),
      whatsapp: formData.get('whatsapp'),
      instagram: formData.get('instagram'),
      email: formData.get('email'),
      ifood_url: formData.get('ifood_url'),
      menu_dino_url: formData.get('menu_dino_url')
    };

    try {
      await update(1, data);
      refetch();
      alert('Informações atualizadas com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar informações: ' + error.message);
    }
  };

  if (loading) {
    return <div className={classes.loading}>Carregando configurações...</div>;
  }

  if (error) {
    return <div className={classes.error}>Erro: {error}</div>;
  }

  const empresaData = empresa?.[0] || {};

  return (
    <div className={classes.configuracoes}>
      <div className={classes.header}>
        <h1>Configurações</h1>
        <p>Gerencie as informações principais da sua sorveteria</p>
      </div>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.section}>
          <h2>Informações da Empresa</h2>
          
          <div className={classes.formGrid}>
            <div className={classes.formGroup}>
              <label htmlFor="nome_fantasia">Nome Fantasia</label>
              <input
                type="text"
                id="nome_fantasia"
                name="nome_fantasia"
                defaultValue={empresaData.nome_fantasia}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="razao_social">Razão Social</label>
              <input
                type="text"
                id="razao_social"
                name="razao_social"
                defaultValue={empresaData.razao_social}
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={empresaData.email}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                defaultValue={empresaData.whatsapp}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="instagram">Instagram</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                defaultValue={empresaData.instagram}
                placeholder="@usuario"
              />
            </div>
          </div>
        </div>

        <div className={classes.section}>
          <h2>Links de Delivery</h2>
          
          <div className={classes.formGrid}>
            <div className={classes.formGroup}>
              <label htmlFor="ifood_url">URL do iFood</label>
              <input
                type="url"
                id="ifood_url"
                name="ifood_url"
                defaultValue={empresaData.ifood_url}
                placeholder="https://www.ifood.com.br/..."
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="menu_dino_url">URL do MenuDino</label>
              <input
                type="url"
                id="menu_dino_url"
                name="menu_dino_url"
                defaultValue={empresaData.menu_dino_url}
                placeholder="https://www.menudino.com.br/..."
              />
            </div>
          </div>
        </div>

        <div className={classes.actions}>
          <button type="submit" className={classes.saveButton}>
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminConfiguracoes;
