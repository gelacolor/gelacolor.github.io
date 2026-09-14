/* =====================================================
   GELACOLOR — encuestas.js
   Scripts específicos de la página "Encuestas".
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenuMovil();
  initScrollReveal();
  initTypewriterCTA();
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
   2. ANIMACIÓN AL HACER SCROLL (reveal)
   El contenedor del formulario y el CTA final (clase
   "js-reveal") aparecen con fade + slide-up.
----------------------------------------------------- */
function initScrollReveal() {
  const elementos = document.querySelectorAll('.js-reveal');
  if (!elementos.length) return;

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
   3. EFECTO TYPEWRITER EN EL TÍTULO DEL CTA FINAL
   Escribe el texto letra por letra cuando la sección
   entra en el viewport (una sola vez), igual que en
   nosotros.html.
----------------------------------------------------- */
function initTypewriterCTA() {
  const titulo = document.querySelector('.encuestas-cta__title');
  if (!titulo) return;

  const texto = titulo.getAttribute('data-text') || titulo.textContent;
  const velocidadMs = 45;
  let yaEscrito = false;

  const escribir = () => {
    if (yaEscrito) return;
    yaEscrito = true;

    titulo.textContent = '';
    let indice = 0;

    const intervalo = setInterval(() => {
      titulo.textContent = texto.slice(0, indice + 1);
      indice++;

      if (indice >= texto.length) {
        clearInterval(intervalo);
        titulo.classList.add('encuestas-cta__title--done');
      }
    }, velocidadMs);
  };

  if (!('IntersectionObserver' in window)) {
    titulo.textContent = texto;
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

  observer.observe(titulo);
}
