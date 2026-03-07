import React from 'react'
import { Link } from 'react-router-dom'
import classes from './Footer.module.css'
import { ReactComponent as InstagramIcon } from '../assets/instagram.svg'
import { ReactComponent as WhatsappIcon } from '../assets/whatsapp.svg'
import { useApi } from '../hooks/useApi'

const Footer = () => {
  const { data: empresa } = useApi('empresa', { _limit: 1 })
  const empresaInfo = empresa?.[0] || {}

  const instagramHandle = empresaInfo.instagram?.replace('@', '') || 'alohasorveteria.pinda'
  const whatsappNumber = empresaInfo.whatsapp?.replace(/\D/g, '') || '12999998888'
  const email = empresaInfo.email || 'contato@alohasorveteria.com.br'
  const telefone = empresaInfo.telefone || '(12) 3123-4567'

  return (
    <footer className={classes.footer}>
      <div className={`container ${classes.footerContainer}`}>
        
        {/* SEÇÃO MENU */}
        <nav className={classes.footerSection}>
          <h3 className={classes.sectionTitle}>Menu</h3>
          <ul className={classes.menuList}>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/produtos'>Produtos</Link></li>
            <li><Link to='/lojas'>Lojas</Link></li>
            <li><Link to='/galeria'>Galeria</Link></li>
            <li><Link to='/contato'>Contato</Link></li>
          </ul>
        </nav>

        {/* SEÇÃO CONTATO */}
        <address className={`${classes.footerSection} ${classes.contato}`}>
          <h3 className={classes.sectionTitle}>Contato</h3>
          <ul className={classes.contactList}>
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <a href={`tel:${whatsappNumber}`}>{telefone}</a>
            </li>
            <li className={classes.socialLinks}>
              <a 
                href={`https://instagram.com/${instagramHandle}`} 
                aria-label='Acessar Instagram'
                target='_blank' 
                rel='noopener noreferrer'
                title='Instagram'
              >
                <InstagramIcon />
              </a>
              <a 
                href={`https://wa.me/${whatsappNumber}`} 
                aria-label='Acessar WhatsApp'
                target='_blank' 
                rel='noopener noreferrer'
                title='WhatsApp'
              >
                <WhatsappIcon />
              </a>
            </li>
          </ul>
        </address>

        
      </div>

      {/* FOOTER BOTTOM */}
      <div className={classes.footerBottom}>
        <p>
          Feito com amor por 
          <a href='https://github.com/j-c-fstk-dev' target='_blank' rel='noopener noreferrer'> Jorge C.</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer