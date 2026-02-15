import React, { useEffect, useState } from 'react'
import classes from './Contato.module.css'
import { ReactComponent as InstagramIcon } from '../assets/instagram.svg'
import { ReactComponent as FacebookIcon } from '../assets/facebook.svg'
import { ReactComponent as WhatsappIcon } from '../assets/whatsapp.svg'
import LayoutRotas from '../components/Utility/LayoutRotas'
import useInput from '../hooks/useInput'
import Head from '../components/Utility/Head';
import Modal from '../components/Utility/Modal';
import { useApi } from '../hooks/useApi';

const Contato = () => {
  const [modalShown, setModalShown] = useState(false);
  const { data: empresas } = useApi('empresas');
  const empresaInfo = empresas?.[0];

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const closeModal = () => {
    setModalShown(false)
  }

  const handleEmailValidation= (value) => {
    const rgxEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rgxEmail.test(value)
  }

  const handleNomeValidation = (value) => {
    return value.trim().length >= 3;
  }

  const handleMessageValidation = (value) => {
    return value.trim().length > 20;
  }

  const {value: nomeValue, handleChange: changeNome, handleBlur: blurNome, error: nomeError, valueIsValid: nomeValid, handleCleanInput: cleanNome} = useInput(handleNomeValidation)
  const {value: emailValue, handleChange: changeEmail, handleBlur: blurEmail, error: emailError, valueIsValid: emailValid, handleCleanInput: cleanEmail} = useInput(handleEmailValidation)
  const {value: messageValue, handleChange: changeMessage, handleBlur: blurMessage, error: messageError, valueIsValid: messageValid, handleCleanInput: cleanMessage} = useInput(handleMessageValidation)

  const submitEmail = (e) => {
    e.preventDefault();

    if (nomeValid && emailValid && messageValid) {
      setModalShown(true)
      cleanNome()
      cleanEmail()
      cleanMessage()
      return
    }

    blurNome();
    blurEmail();
    blurMessage();
  }

  const formatWhatsApp = (phone) => {
    if (!phone) return '#';
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleaned}`;
  }

  const formatInstagram = (username) => {
    if (!username) return '#';
    const cleaned = username.replace('@', '');
    return `https://instagram.com/${cleaned}`;
  }

  return (
    <>
    {modalShown && 
    <Modal onClose={closeModal}>
        <div className={classes.modal}>
          <h3>Agradecemos por entrar em contato!</h3>
          <p>Entraremos em contato em breve. Aguarde.</p>
          <button className='btn-amarelo' onClick={closeModal}>Ok</button>
        </div>
      </Modal>
    }
    <LayoutRotas titulo='Fale com a gente!' descricao='Envie sua mensagem para a Aloha Sorveteria'>
      <Head title='Contato - Aloha Sorveteria' description='Entre em contato com a Aloha Sorveteria de Pindamonhangaba' />
      <form className={classes.form} onSubmit={submitEmail}>
        <div className={`${classes.inputField} ${nomeError ? classes.error : ''}`}>
          <label htmlFor='nome'>Nome completo</label>
          <input type='text' value={nomeValue} onChange={changeNome} onBlur={blurNome} name='nome_completo' id='nome' placeholder='Ex: Ana de Souza' />
          {nomeError && <p>Digite seu nome corretamente.</p>}
        </div>
        <div className={`${classes.inputField} ${emailError ? classes.error : ''}`}>
          <label htmlFor='email'>Email de contato</label>
          <input type='email' value={emailValue} onChange={changeEmail} onBlur={blurEmail} name='email' id='email' placeholder='Ex: seuemail@email.com' />
          {emailError && <p>O valor não corresponde a um email.</p>}
        </div>
        <div className={`${classes.inputField} ${classes.inputFieldMensagem} ${messageError ? classes.error : ''}`}>
          <label htmlFor='mensagem'>Sua mensagem</label>
          <textarea name='mensagem' value={messageValue} onChange={changeMessage} onBlur={blurMessage} id='mensagem' cols='30' placeholder='Ex: Olá. Gostaria de saber sobre...' ></textarea>
          {messageError && <p>A mensagem deve possuir ao menos 20 caracteres.</p>}
        </div>
        <button type='submit' className={`btn-amarelo ${classes.btnEnviar}`}>Enviar mensagem</button>
      </form>

      <address className={classes.address}>
        <ul>
          <li>Email: {empresaInfo?.email || 'contato@alohasorveteria.com.br'}</li>
          <li>Telefone: {empresaInfo?.whatsapp || '(12) 99724-2694'}</li>
          <li className={classes.redesSociais}>
            <a href={formatInstagram(empresaInfo?.instagram)} target='_blank' rel='noopener noreferrer' aria-label='acessar instagram'><InstagramIcon /></a>
            <a href={formatWhatsApp(empresaInfo?.whatsapp)} target='_blank' rel='noopener noreferrer' aria-label='acessar whatsapp'><WhatsappIcon /></a>
          </li>
        </ul>
      </address>
    </LayoutRotas>
    </>
  )
}

export default Contato