import React from "react";
import { Link } from "react-router-dom";
import classes from "./Entrada.module.css";
import ImgEntrada from "../../assets/sorvete-entrada.webp";
import LogoAloha from "../../assets/logo.jpg";
import { ReactComponent as ArrowSvg } from "../../assets/arrow-right.svg";

const Entrada = () => {
  return (
    <section className={classes.entrada}>
      <div className={classes.container}>
        <div className={classes.principal}>
          <div className={classes.logoContainer}>
            <img src={LogoAloha} alt="Aloha Sorveteria" className={classes.logo} />
          </div>
          <h1>
            Sorvetes Artesanais
          </h1>
          <p className={classes.descricao}>
            Feitos com leite fresco da fazenda, <br />
            sem gordura vegetal e sem conservantes.
          </p>
          <Link to="/lojas">
            Encontre a loja mais perto de você <ArrowSvg />
          </Link>
        </div>
      </div>
      <div className={classes.img}>
        <img src={ImgEntrada} alt="Sorvete artesanal Aloha" />
      </div>
      <ul className={classes.caracts}>
        <li>Mais de 30 sabores artesanais</li>
        <li>Leite fresco direto da fazenda</li>
        <li>Ambiente familiar com área kids</li>
      </ul>
    </section>
  );
};

export default Entrada;
