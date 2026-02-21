
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import classes from "./Slider.module.css";
import { ReactComponent as IconArrowRight } from "../../assets/arrow-right-short.svg";
import { ReactComponent as IconArrowLeft } from "../../assets/arrow-left-short.svg";
import PropTypes from "prop-types";
import "aos/dist/aos.css";
import AOS from "aos";
import SliderModal from "./SliderModal";

const ItemsSlider = memo(({ itemWidth, item, openModal }) => {
  const defaultImage = 'https://via.placeholder.com/300x300.png?text=Sem+Imagem';

  return (
    <li style={{ minWidth: `${itemWidth}px` }}>
      <button
        className={classes.btnSlideImg}
        onClick={() => openModal(item)}
        draggable="false"
      >
        {/* Container para os selos */}
        <div className={classes.sealContainer}>
          {item.is_zero_lactose && <span className={`${classes.seal} ${classes.lactose}`}>0% Lactose</span>}
          {item.is_diet && <span className={`${classes.seal} ${classes.diet}`}>Diet</span>}
        </div>

        <img
          src={item.imagem_url || defaultImage} // Usa a URL do DB ou uma imagem padrão
          alt={item.nome}
          draggable="false"
          onError={(e) => { e.target.onerror = null; e.target.src=defaultImage; }} // Fallback se a imagem falhar
        />
        <p className={classes.nomeItem}>{item.nome}</p>
      </button>
    </li>
  );
});

const Slider = ({ items, colorsBtn }) => {
  const totalItens = items.length;
  const [itensShown, setItensShown] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();
  const [itemWidth, setItemWidth] = useState(0);
  const [currentItemModal, setCurrentItemModal] = useState(null);
  const [modalIsShown, setModalIsShown] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 0,
    });
  }, []);

  useEffect(() => {
    if (slideRef.current) {
        setItemWidth(slideRef.current.offsetWidth / itensShown);
        slideRef.current.style.transform = `translateX(${-(
          currentIndex * itemWidth
        )}px)`;
    }
  }, [currentIndex, itemWidth, itensShown]);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }, []);

  useEffect(() => {
    const mediaQuerySizes = [
      { windowSize: 900, itensToShow: 4 },
      { windowSize: 750, itensToShow: 3 },
      { windowSize: 550, itensToShow: 2 },
      { windowSize: 360, itensToShow: 1 },
    ];

    const changeSlideItemsToShown = debounce(() => {
        if (!slideRef.current) return;
        const reverseOrderMediaQueries = [...mediaQuerySizes].reverse();
        const windowMatch = reverseOrderMediaQueries.find(
            (mediaQuery) => mediaQuery.windowSize >= window.innerWidth
        );

        const newItensShown = windowMatch ? windowMatch.itensToShow : 5;
        setItensShown(newItensShown);
        setItemWidth(slideRef.current.offsetWidth / newItensShown);
        setCurrentIndex(0);
    }, 250);

    changeSlideItemsToShown();

    window.addEventListener("resize", changeSlideItemsToShown);
    return () => {
      window.removeEventListener("resize", changeSlideItemsToShown);
    };
  }, [debounce, itensShown]);

  const nextSlideHandler = () => {
    if (currentIndex < totalItens - itensShown) {
      setCurrentIndex((state) => state + 1);
    }
  };

  const previousSlideHandler = () => {
    if (currentIndex > 0) {
      setCurrentIndex((state) => state - 1);
    }
  };

  const handleOpenModal = useCallback((item) => {
    setModalIsShown(true);
    setCurrentItemModal(item);
  }, []);

  const handleCloseModal = () => {
    setModalIsShown(false);
  };

  if (!items || items.length === 0) {
    return <p>Nenhum produto para exibir nesta categoria.</p>;
  }

  const canSlide = totalItens > itensShown;

  return (
    <>
      {modalIsShown && (
        <SliderModal
          currentItemModal={currentItemModal}
          onClose={handleCloseModal}
        />
      )}
      <div className={classes.wrapSlider} data-aos="fade-up">
        {canSlide && (
          <>
            <button
              className={classes.btnAnt}
              onClick={previousSlideHandler}
              style={colorsBtn}
              aria-label="item anterior"
              disabled={currentIndex === 0}
            >
              <IconArrowLeft />
            </button>
            <button
              className={classes.btnDep}
              onClick={nextSlideHandler}
              style={colorsBtn}
              aria-label="item posterior"
              disabled={currentIndex >= totalItens - itensShown}
            >
              <IconArrowRight />
            </button>
          </>
        )}
        <div className={classes.sliderContainer}>
          <ul className={classes.slider} ref={slideRef}>
            {items.map((item) => (
              <ItemsSlider
                key={item.id}
                item={item}
                openModal={handleOpenModal}
                itemWidth={itemWidth}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

Slider.propTypes = {
  items: PropTypes.array.isRequired,
  colorsBtn: PropTypes.object,
};

Slider.defaultProps = {
  colorsBtn: {
    backgroundColor: "#ac83fa",
    color: "#4b1688",
  },
};

export default Slider;
