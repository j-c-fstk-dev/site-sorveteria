import React, { useEffect } from 'react';
import classes from './Contato.module.css';
import { ReactComponent as InstagramIcon } from '../assets/instagram.svg';
import { ReactComponent as WhatsappIcon } from '../assets/whatsapp.svg';
import LayoutRotas from '../components/Utility/LayoutRotas';
import { useApi } from '../hooks/useApi';
import ContatoForm from '../components/Contato/ContatoForm';

const Contato = () => {
  const { data: empresas } = useApi('empresa', { '_limit': 1 });
  const empresa = empresas[0] || {};
  const { email, telefone, instagram, whatsapp } = empresa;

  useEffect(() => {
    document.title = 'Contato - Gelato & Grano';
  }, []);

  return (
    <LayoutRotas>
      <div className={classes.container}>
        <div className={classes.info}>
          <h2>Nossas Informações</h2>
          <p>Se preferir, entre em contato diretamente por um dos canais abaixo.</p>
          <ul>
            <li><strong>E-mail:</strong> {email}</li>
            <li><strong>Telefone:</strong> {telefone}</li>
          </ul>
          <div className={classes.social}>
            <a href={instagram} target="_blank" rel="noreferrer">
              <InstagramIcon />
            </a>
            <a href={`https://wa.me/${whatsapp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">
              <WhatsappIcon />
            </a>
          </div>
        </div>

        <div className={classes.formContainer}>
          <h2>Mande uma Mensagem</h2>
          <ContatoForm />
        </div>

      </div>
    </LayoutRotas>
  );
};

export default Contato;
