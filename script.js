/* =====================================================
   GELACOLOR — script.js
   Scripts generales del sitio (index.html).
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenuMovil();
  initCarrusel();
  initScrollReveal();
  initScrollSpy();
  initHeaderDinamico();
});

/* -----------------------------------------------------
   1. MENÚ HAMBURGUESA (móvil)
----------------------------------------------------- */
function initMenuMovil() {
  const boton = document.querySelector('.header__menu-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!boton || !menu) return;

  boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('nav-menu--open');
    boton.classList.toggle('header__menu-toggle--open', abierto);
    boton.setAttribute('aria-expanded', String(abierto));
    boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });

  menu.querySelectorAll('.nav-menu__link').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      menu.classList.remove('nav-menu--open');
      boton.classList.remove('header__menu-toggle--open');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

/* -----------------------------------------------------
   2. CARRUSEL DEL HERO
   Controla flechas, puntos y avance automático.
   Las imágenes y su texto alternativo viven en este
   arreglo; para agregar una slide nueva solo hay que
   sumar un objeto aquí (no hace falta tocar el HTML).
----------------------------------------------------- */
function initCarrusel() {
  const heroSection = document.querySelector('.hero-section');
  const imagen = document.getElementById('heroImage');
  const flechaIzq = document.querySelector('.hero-section__arrow--left');
  const flechaDer = document.querySelector('.hero-section__arrow--right');
  const puntos = document.querySelectorAll('.hero-section__dot');

  if (!heroSection || !imagen || !puntos.length) return;

  const slides = [
    { src: 'img/gelatina-con-frutas.jpg', alt: 'Gelatina con frutas' },
    { src: 'img/hero-variedad-sabores.jpg', alt: 'Variedad de sabores Gelacolor' },
    { src: 'img/hero-familia-disfrutando.jpg', alt: 'Familia disfrutando gelatinas Gelacolor' }
  ];

  let indiceActual = 0;
  let temporizador = null;
  const DURACION_AUTOPLAY = 5000;
  const DURACION_FUNDIDO = 350;

  function irASlide(nuevoIndice) {
    indiceActual = (nuevoIndice + slides.length) % slides.length;

    // Fundido de salida
    imagen.style.opacity = '0';

    setTimeout(() => {
      imagen.src = slides[indiceActual].src;
      imagen.alt = slides[indiceActual].alt;
      // Fundido de entrada
      imagen.style.opacity = '1';
    }, DURACION_FUNDIDO);

    puntos.forEach((punto, i) => {
      punto.classList.toggle('hero-section__dot--active', i === indiceActual);
    });
  }

  function siguienteSlide() {
    irASlide(indiceActual + 1);
  }

  function anteriorSlide() {
    irASlide(indiceActual - 1);
  }

  function iniciarAutoplay() {
    detenerAutoplay();
    temporizador = setInterval(siguienteSlide, DURACION_AUTOPLAY);
  }

  function detenerAutoplay() {
    if (temporizador) clearInterval(temporizador);
  }

  if (flechaDer) {
    flechaDer.addEventListener('click', () => {
      siguienteSlide();
      iniciarAutoplay(); // reinicia el conteo tras interacción manual
    });
  }

  if (flechaIzq) {
    flechaIzq.addEventListener('click', () => {
      anteriorSlide();
      iniciarAutoplay();
    });
  }

  puntos.forEach((punto, i) => {
    punto.style.cursor = 'pointer';
    punto.addEventListener('click', () => {
      irASlide(i);
      iniciarAutoplay();
    });
  });

  // Pausa el autoplay mientras el usuario tiene el mouse encima
  heroSection.addEventListener('mouseenter', detenerAutoplay);
  heroSection.addEventListener('mouseleave', iniciarAutoplay);

  iniciarAutoplay();
}

/* -----------------------------------------------------
   3. ANIMACIÓN AL HACER SCROLL (reveal) + STAGGER
   Los elementos con clase "js-reveal" aparecen con
   fade + slide-up al entrar en el viewport. Las tarjetas
   de producto además reciben un pequeño retraso entre
   sí, para que aparezcan una tras otra.
----------------------------------------------------- */
function initScrollReveal() {
  const elementos = document.querySelectorAll('.js-reveal');
  if (!elementos.length) return;

  // Stagger: a cada product-card le asignamos un retraso creciente
  const tarjetas = document.querySelectorAll('.product-card.js-reveal');
  tarjetas.forEach((tarjeta, i) => {
    tarjeta.style.transitionDelay = `${i * 100}ms`;
  });

  if (!('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('js-reveal--visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('js-reveal--visible');
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach((el) => observer.observe(el));
}

/* -----------------------------------------------------
   4. ENLACE ACTIVO DINÁMICO (scrollspy)
   Como en index.html los enlaces son anclas dentro de la
   misma página, detectamos qué sección está en pantalla
   y resaltamos el link correspondiente del navbar.
----------------------------------------------------- */
function initScrollSpy() {
  const enlaces = document.querySelectorAll('.nav-menu__link[href^="#"]');
  if (!enlaces.length) return;

  const secciones = Array.from(enlaces)
    .map((enlace) => document.querySelector(enlace.getAttribute('href')))
    .filter(Boolean);

  if (!secciones.length || !('IntersectionObserver' in window)) return;

  const marcarActivo = (id) => {
    enlaces.forEach((enlace) => {
      enlace.classList.toggle('nav-menu__link--active', enlace.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          marcarActivo(entrada.target.id);
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
  );

  secciones.forEach((seccion) => observer.observe(seccion));
}

/* -----------------------------------------------------
   5. HEADER DINÁMICO AL HACER SCROLL
   Se vuelve más compacto y con más sombra al bajar,
   para dar sensación de app moderna.
----------------------------------------------------- */
function initHeaderDinamico() {
  const header = document.querySelector('.header');
  if (!header) return;

  const UMBRAL = 40;
  let ticking = false;

  function actualizarHeader() {
    header.classList.toggle('header--scrolled', window.scrollY > UMBRAL);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(actualizarHeader);
      ticking = true;
    }
  });

  actualizarHeader(); // estado inicial por si la página carga ya con scroll
}
