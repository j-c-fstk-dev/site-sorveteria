import React, { useEffect } from 'react'
import classes from './Contato.module.css'
import { ReactComponent as InstagramIcon } from '../assets/instagram.svg'
import { ReactComponent as WhatsappIcon } from '../assets/whatsapp.svg'
import LayoutRotas from '../components/Utility/LayoutRotas'
import useInput from '../hooks/useInput'
import { useApi, useApiMethod } from '../hooks/useApi'
import ContatoForm from '../components/Contato/ContatoForm'

const Contato = () => {
  const { data: empresa, loading, error } = useApi('empresa', { '_limit': 1 });
  const { nome, email, telefone, instagram, whatsapp, facebook } = empresa || {};

  useEffect(() => {
    document.title = 'Contato - Gelato & Grano'
  }, [])

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
            {/* Ícone do Facebook removido temporariamente se não houver link */}
            {/* <a href={facebook} target="_blank" rel="noreferrer">
              <FacebookIcon />
            </a> */}
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
  )
}

export default Contato
