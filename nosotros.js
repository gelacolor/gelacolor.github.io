/* =====================================================
   GELACOLOR — nosotros.js
   Scripts específicos de la página "Nosotros".
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenuMovil();
  initEnlaceActivo();
  initScrollReveal();
  initTypewriterFrase();
});

/* -----------------------------------------------------
   1. MENÚ HAMBURGUESA (móvil)
   Abre y cierra el nav-menu al tocar el botón.
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

  // Cierra el menú al elegir una opción (útil en móvil)
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
   2. ENLACE ACTIVO DEL NAVBAR (dinámico)
   Detecta la página actual y marca el enlace correspondiente,
   así no hay que editar la clase "nav-menu__link--active"
   a mano en cada archivo HTML.
----------------------------------------------------- */
function initEnlaceActivo() {
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  const enlaces = document.querySelectorAll('.nav-menu__link');

  enlaces.forEach((enlace) => {
    const destino = enlace.getAttribute('href');
    enlace.classList.toggle('nav-menu__link--active', destino === paginaActual);
  });
}

/* -----------------------------------------------------
   3. ANIMACIÓN AL HACER SCROLL (reveal)
   Las secciones marcadas con "js-reveal" aparecen con
   fade + slide-up cuando entran en el viewport.
----------------------------------------------------- */
function initScrollReveal() {
  const elementos = document.querySelectorAll('.js-reveal');
  if (!elementos.length) return;

  // Si el navegador no soporta IntersectionObserver, se muestran directo
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
   4. EFECTO TYPEWRITER EN LA FRASE DESTACADA
   Escribe el texto letra por letra cuando la sección
   entra en el viewport (una sola vez).
----------------------------------------------------- */
function initTypewriterFrase() {
  const parrafo = document.querySelector('.frase-destacada__text');
  if (!parrafo) return;

  const texto = parrafo.getAttribute('data-text') || parrafo.textContent;
  const velocidadMs = 35;
  let yaEscrito = false;

  const escribir = () => {
    if (yaEscrito) return;
    yaEscrito = true;

    parrafo.textContent = '';
    let indice = 0;

    const intervalo = setInterval(() => {
      parrafo.textContent = texto.slice(0, indice + 1);
      indice++;

      if (indice >= texto.length) {
        clearInterval(intervalo);
        parrafo.classList.add('frase-destacada__text--done');
      }
    }, velocidadMs);
  };

  if (!('IntersectionObserver' in window)) {
    parrafo.textContent = texto;
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          escribir();
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(parrafo);
}
