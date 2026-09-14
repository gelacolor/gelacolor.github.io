/* =====================================================
   GELACOLOR — productos.js
   Scripts específicos de la página "Productos".
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenuMovil();
  initScrollReveal();
  initFiltroYBuscador();
  initCantidadYCarrito();
  initLightbox();
  initFAQ();
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
----------------------------------------------------- */
function initScrollReveal() {
  const elementos = document.querySelectorAll('.js-reveal');
  if (!elementos.length) return;

  document.querySelectorAll('.categoria-productos__grid').forEach((grid) => {
    const tarjetas = grid.querySelectorAll('.producto-card.js-reveal');
    tarjetas.forEach((tarjeta, i) => {
      tarjeta.style.transitionDelay = `${i * 100}ms`;
    });
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
   3. FILTRO POR CATEGORÍA + BUSCADOR (combinados)
   Ambos controles comparten un único estado y una sola
   función que decide qué mostrar. El filtro de categoría
   además hace un pequeño fundido al cambiar.
----------------------------------------------------- */
function initFiltroYBuscador() {
  const botones = document.querySelectorAll('.filtro-categorias__btn');
  const input = document.getElementById('buscadorInput');
  const secciones = document.querySelectorAll('.categoria-productos');

  if (!secciones.length) return;

  let categoriaActual = 'todos';
  let textoBusqueda = '';

  function aplicarFiltros() {
    secciones.forEach((seccion) => {
      const coincideCategoria = categoriaActual === 'todos' || seccion.getAttribute('data-categoria') === categoriaActual;
      let algunaTarjetaVisible = false;

      seccion.querySelectorAll('.producto-card').forEach((tarjeta) => {
        const nombre = (tarjeta.getAttribute('data-nombre') || '').toLowerCase();
        const coincideTexto = textoBusqueda === '' || nombre.includes(textoBusqueda);
        const visible = coincideCategoria && coincideTexto;

        tarjeta.classList.toggle('categoria-productos--oculta-card', !visible);
        if (visible) algunaTarjetaVisible = true;
      });

      seccion.classList.toggle('categoria-productos--oculta', !algunaTarjetaVisible);
    });
  }

  if (botones.length) {
    botones.forEach((boton) => {
      boton.addEventListener('click', () => {
        if (boton.classList.contains('filtro-categorias__btn--active')) return;

        botones.forEach((b) => b.classList.remove('filtro-categorias__btn--active'));
        boton.classList.add('filtro-categorias__btn--active');
        categoriaActual = boton.getAttribute('data-categoria');

        // Pequeño fundido: se desvanecen, se actualiza qué se ve, y vuelven a aparecer
        secciones.forEach((s) => s.classList.add('categoria-productos--transicion'));
        setTimeout(() => {
          aplicarFiltros();
          secciones.forEach((s) => s.classList.remove('categoria-productos--transicion'));
        }, 220);
      });
    });
  }

  if (input) {
    input.addEventListener('input', () => {
      textoBusqueda = input.value.trim().toLowerCase();
      aplicarFiltros();
    });
  }
}

/* -----------------------------------------------------
   4. CANTIDAD POR TARJETA + AGREGAR AL CARRITO
   El carrito en sí (guardado, panel, envío por WhatsApp)
   vive en carrito.js, compartido con promociones.html.
   Aquí solo manejamos el selector de cantidad de cada
   tarjeta y llamamos a GelacolorCarrito.agregar().
----------------------------------------------------- */
function initCantidadYCarrito() {
  document.querySelectorAll('.producto-card').forEach((tarjeta) => {
    const valorSpan = tarjeta.querySelector('.cantidad-valor');
    const btnMenos = tarjeta.querySelector('.cantidad-btn--menos');
    const btnMas = tarjeta.querySelector('.cantidad-btn--mas');
    const btnAgregar = tarjeta.querySelector('.producto-card__agregar');

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
      btnAgregar.classList.add('producto-card__agregar--agregado');
      setTimeout(() => {
        btnAgregar.textContent = textoOriginal;
        btnAgregar.classList.remove('producto-card__agregar--agregado');
      }, 900);

      // reinicia el contador de esa tarjeta a 1
      cantidad = 1;
      valorSpan.textContent = cantidad;
    });
  });
}

/* -----------------------------------------------------
   5. LIGHTBOX (zoom de imágenes)
----------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const imagenGrande = document.getElementById('lightboxImagen');
  const botonCerrar = document.getElementById('lightboxCerrar');

  if (!lightbox || !imagenGrande) return;

  function abrir(src, alt) {
    imagenGrande.src = src;
    imagenGrande.alt = alt;
    lightbox.classList.add('lightbox--activo');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function cerrar() {
    lightbox.classList.remove('lightbox--activo');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.producto-card__image--zoom').forEach((img) => {
    img.addEventListener('click', () => abrir(img.src, img.alt));
  });

  if (botonCerrar) botonCerrar.addEventListener('click', cerrar);

  // Cerrar al hacer clic fuera de la imagen (en el fondo oscuro)
  lightbox.addEventListener('click', (evento) => {
    if (evento.target === lightbox) cerrar();
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrar();
  });
}

/* -----------------------------------------------------
   6. FAQ (ACORDEÓN)
----------------------------------------------------- */
function initFAQ() {
  const preguntas = document.querySelectorAll('.faq-item__pregunta');
  if (!preguntas.length) return;

  preguntas.forEach((boton) => {
    const respuesta = boton.parentElement.querySelector('.faq-item__respuesta');
    if (!respuesta) return;

    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') === 'true';

      boton.setAttribute('aria-expanded', String(!abierto));
      respuesta.style.maxHeight = abierto ? null : `${respuesta.scrollHeight}px`;
    });
  });
}
