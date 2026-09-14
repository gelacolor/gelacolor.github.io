/* =====================================================
   GELACOLOR — carrito.js
   Lógica compartida del carrito de pedido, usada por
   productos.html y promociones.html. Se guarda en
   localStorage bajo una sola clave, así el carrito
   persiste entre ambas páginas y al recargar.
   ===================================================== */

const GelacolorCarrito = (() => {
  const CLAVE_CARRITO = 'gelacolor_carrito';
  const NUMERO_WHATSAPP = '573143119195';

  let elementos = null; // referencias al DOM, se llenan en init()

  /* --- Lectura / escritura en localStorage --- */
  function obtenerCarrito() {
    try {
      const guardado = localStorage.getItem(CLAVE_CARRITO);
      return guardado ? JSON.parse(guardado) : [];
    } catch (error) {
      console.error('No se pudo leer el carrito guardado:', error);
      return [];
    }
  }

  function guardarCarrito(carrito) {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
      console.error('No se pudo guardar el carrito:', error);
    }
  }

  /* --- Operaciones sobre el carrito --- */
  function agregar(item) {
    const carrito = obtenerCarrito();
    const existente = carrito.find((p) => p.nombre === item.nombre);

    if (existente) {
      existente.cantidad += item.cantidad;
    } else {
      carrito.push(item);
    }

    guardarCarrito(carrito);
    renderizar();
  }

  function quitar(nombre) {
    const carrito = obtenerCarrito().filter((p) => p.nombre !== nombre);
    guardarCarrito(carrito);
    renderizar();
  }

  function vaciar() {
    guardarCarrito([]);
    renderizar();
  }

  /* --- Interfaz visual (ícono flotante + panel) --- */
  function renderizar() {
    if (!elementos) return;

    const carrito = obtenerCarrito();
    const { lista, vacioMsg, contador, botonEnviar } = elementos;

    lista.innerHTML = '';

    const totalItems = carrito.reduce((suma, p) => suma + p.cantidad, 0);
    contador.textContent = totalItems;

    const hayItems = carrito.length > 0;
    vacioMsg.style.display = hayItems ? 'none' : 'block';
    botonEnviar.disabled = !hayItems;

    carrito.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'carrito-panel__item';
      li.innerHTML = `
        <div class="carrito-panel__item-info">
          <span class="carrito-panel__item-nombre">${item.cantidad}x ${item.nombre}</span>
          <span class="carrito-panel__item-detalle">${item.presentacion} · ${item.precio}</span>
        </div>
        <button class="carrito-panel__item-quitar" type="button" aria-label="Quitar ${item.nombre}">&times;</button>
      `;
      li.querySelector('.carrito-panel__item-quitar').addEventListener('click', () => quitar(item.nombre));
      lista.appendChild(li);
    });
  }

  function init() {
    const botonToggle = document.getElementById('carritoToggle');
    const panel = document.getElementById('carritoPanel');
    const botonCerrar = document.getElementById('carritoCerrar');
    const lista = document.getElementById('carritoLista');
    const vacioMsg = document.getElementById('carritoVacio');
    const contador = document.getElementById('carritoContador');
    const botonEnviar = document.getElementById('carritoEnviar');

    if (!botonToggle || !panel) return;

    elementos = { lista, vacioMsg, contador, botonEnviar };

    function abrirPanel() {
      panel.classList.add('carrito-panel--abierto');
      panel.setAttribute('aria-hidden', 'false');
    }

    function cerrarPanel() {
      panel.classList.remove('carrito-panel--abierto');
      panel.setAttribute('aria-hidden', 'true');
    }

    botonToggle.addEventListener('click', abrirPanel);
    if (botonCerrar) botonCerrar.addEventListener('click', cerrarPanel);

    if (botonEnviar) {
      botonEnviar.addEventListener('click', () => {
        const carrito = obtenerCarrito();
        if (!carrito.length) return;

        let mensaje = 'Hola, quiero pedir:\n';
        carrito.forEach((item) => {
          mensaje += `- ${item.cantidad}x ${item.nombre} (${item.presentacion}) - ${item.precio}\n`;
        });

        const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank', 'noopener');
      });
    }

    renderizar(); // muestra lo que ya había guardado, si algo había
  }

  // API pública: lo que pueden usar productos.js y promociones.js
  return { init, agregar, quitar, vaciar };
})();

document.addEventListener('DOMContentLoaded', () => {
  GelacolorCarrito.init();
});
