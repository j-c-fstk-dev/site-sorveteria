import React from 'react';
import useInput from '../../hooks/useInput';
import { useApiMethod } from '../../hooks/useApi';
import classes from './ContatoForm.module.css';

const ContatoForm = () => {
  const nomeInput = useInput(value => value.trim() !== '');
  const emailInput = useInput(value => value.includes('@'));
  const mensagemInput = useInput(value => value.trim() !== '');
  const { execute: sendMessage, loading, error, data } = useApiMethod('create', 'mensagens');

  let formIsValid = nomeInput.isValid && emailInput.isValid && mensagemInput.isValid;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    await sendMessage({
      nome: nomeInput.value,
      email: emailInput.value,
      mensagem: mensagemInput.value,
      lido: false,
      created_at: new Date().toISOString(),
    });

    nomeInput.reset();
    emailInput.reset();
    mensagemInput.reset();
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {data && <p className={classes.success}>Mensagem enviada com sucesso!</p>}
      {error && <p className={classes.error}>Erro ao enviar mensagem: {error}</p>}

      <div className={nomeInput.hasError ? `${classes.formControl} ${classes.invalid}` : classes.formControl}>
        <label htmlFor='nome'>Seu Nome</label>
        <input 
          type='text' 
          id='nome' 
          value={nomeInput.value} 
          onChange={nomeInput.valueChangeHandler} 
          onBlur={nomeInput.inputBlurHandler} 
        />
        {nomeInput.hasError && <p className={classes.errorText}>Por favor, insira seu nome.</p>}
      </div>

      <div className={emailInput.hasError ? `${classes.formControl} ${classes.invalid}` : classes.formControl}>
        <label htmlFor='email'>Seu E-mail</label>
        <input 
          type='email' 
          id='email' 
          value={emailInput.value} 
          onChange={emailInput.valueChangeHandler} 
          onBlur={emailInput.inputBlurHandler} 
        />
        {emailInput.hasError && <p className={classes.errorText}>Por favor, insira um e-mail válido.</p>}
      </div>

      <div className={mensagemInput.hasError ? `${classes.formControl} ${classes.invalid}` : classes.formControl}>
        <label htmlFor='mensagem'>Sua Mensagem</label>
        <textarea 
          id='mensagem' 
          rows='5'
          value={mensagemInput.value} 
          onChange={mensagemInput.valueChangeHandler} 
          onBlur={mensagemInput.inputBlurHandler}
        ></textarea>
        {mensagemInput.hasError && <p className={classes.errorText}>Por favor, escreva sua mensagem.</p>}
      </div>

      <div className={classes.actions}>
        <button disabled={!formIsValid || loading}>{loading ? 'Enviando...' : 'Enviar Mensagem'}</button>
      </div>
    </form>
  );
};

export default ContatoForm;
