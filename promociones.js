/* =====================================================
   GELACOLOR — promociones.js
   Scripts específicos de la página "Promociones".
   El carrito en sí (guardado, panel, envío por WhatsApp)
   vive en carrito.js, compartido con productos.html.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenuMovil();
  initScrollReveal();
  initCantidadYCarrito();
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
   2. ANIMACIÓN AL HACER SCROLL (reveal) + STAGGER
   Las 6 tarjetas de promoción (clase "js-reveal") aparecen
   con fade + slide-up, una tras otra.
----------------------------------------------------- */
function initScrollReveal() {
  const elementos = document.querySelectorAll('.js-reveal');
  if (!elementos.length) return;

  const tarjetas = document.querySelectorAll('.promocion-card.js-reveal');
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
   3. CANTIDAD POR TARJETA + AGREGAR AL CARRITO
   Solo aplica a las tarjetas de combo con precio fijo
   (las que tienen data-nombre); las 3 tarjetas informativas
   no tienen estos controles, así que el selector simplemente
   no las encuentra y las ignora.
----------------------------------------------------- */
function initCantidadYCarrito() {
  document.querySelectorAll('.promocion-card[data-nombre]').forEach((tarjeta) => {
    const valorSpan = tarjeta.querySelector('.cantidad-valor');
    const btnMenos = tarjeta.querySelector('.cantidad-btn--menos');
    const btnMas = tarjeta.querySelector('.cantidad-btn--mas');
    const btnAgregar = tarjeta.querySelector('.promocion-card__agregar');

    if (!valorSpan || !btnMenos || !btnMas || !btnAgregar) return;

    let cantidad = 1;

    btnMenos.addEventListener('click', () => {
      cantidad = Math.max(1, cantidad - 1);
      valorSpan.textContent = cantidad;
    });

    btnMas.addEventListener('click', () => {
      cantidad = Math.min(20, cantidad + 1);
      valorSpan.textContent = cantidad;
    });

    btnAgregar.addEventListener('click', () => {
      GelacolorCarrito.agregar({
        nombre: tarjeta.getAttribute('data-nombre'),
        presentacion: tarjeta.getAttribute('data-presentacion'),
        precio: tarjeta.getAttribute('data-precio'),
        cantidad
      });

      // feedback visual breve
      const textoOriginal = btnAgregar.textContent;
      btnAgregar.textContent = 'Agregado ✓';
      btnAgregar.classList.add('promocion-card__agregar--agregado');
      setTimeout(() => {
        btnAgregar.textContent = textoOriginal;
        btnAgregar.classList.remove('promocion-card__agregar--agregado');
      }, 900);

      // reinicia el contador de esa tarjeta a 1
      cantidad = 1;
      valorSpan.textContent = cantidad;
    });
  });
}
