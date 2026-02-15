import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import classes from './Header.module.css';
import {ReactComponent as IconMenu} from '../assets/menu.svg'
import { useApi } from '../hooks/useApi';

const Header = () => {
  const [menuIsVisible, setMenuIsVisible] = useState(false);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const menuRef = useRef();
  const { data: empresas } = useApi('empresas');

  useEffect(() => {
    if (empresas && empresas.length > 0) {
      setEmpresaInfo(empresas[0]);
    }
  }, [empresas]);

  useEffect(() => {
    const checkVisibility = ({target}) => {
      if (window.innerWidth <= 550) {
        if (target !== menuRef.current && !menuRef.current.contains(target)) {
          setMenuIsVisible(false)
        }
      }
    }

    window.addEventListener('click', checkVisibility);
    return () => window.removeEventListener('click', checkVisibility)
  }, [])
  
  const showMenu = () => {
    setMenuIsVisible(true)
  }

  return (
    <header className={classes.header}> 
      <nav className='container'>
      <Link to='/' className={classes.logo}>
        {empresaInfo?.nome_fantasia || 'Aloha Sorveteria'}
      </Link>
      <button className={`${menuIsVisible ? classes.shown : ''} ${classes.menuBtn}`} onClick={showMenu} ref={menuRef} aria-label='Abrir menu'><IconMenu/></button>
        <ul className={`${menuIsVisible ? classes.shown : ''} ${classes.itensMenu}`}>
          <li><NavLink to='/produtos' className={({isActive}) => isActive ? classes.active : ''}>Produtos</NavLink></li>
          <li><NavLink to='/lojas' className={({isActive}) => isActive ? classes.active : ''}>Lojas</NavLink></li>
          <li><NavLink to='/galeria' className={({isActive}) => isActive ? classes.active : ''}>Galeria</NavLink></li>
          <li><NavLink to='/contato' className={({isActive}) => isActive ? classes.active : ''}>Contato</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header