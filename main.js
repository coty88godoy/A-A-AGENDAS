// A&A Agendas | Cuadernos — interacciones del sitio

// Número de WhatsApp en formato internacional (Argentina: 54 9 + característica + número)
const WA_NUMBER = '5493525404356';
const WA_DEFAULT = 'Hola! Quiero hacer un pedido de agenda/cuaderno personalizado.';
const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

// Todos los enlaces con data-wa abren WhatsApp con un mensaje precargado
const setupWa = (root = document) => root.querySelectorAll('[data-wa]').forEach((el) => {
  el.href = waLink(el.getAttribute('data-wa') || WA_DEFAULT);
  el.target = '_blank';
  el.rel = 'noopener';
});
setupWa();

// Menú móvil
const nav = document.querySelector('.nav');
const burger = document.querySelector('.nav__burger');
const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
document.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ---------- Catálogo (datos en catalogo.js) ----------
const TODOS_VISIBLES = 8; // cuántos productos se muestran en "Todos" antes de "Ver todo el catálogo"
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const catName = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nombre || '';
const COLORES = ['magenta', 'black', 'white'];
const GIROS = [-4, 3, -3, 4];

const precioDe = (p, linea) => {
  if (p.sinLineas) return p.precio || null;
  const tabla = p.precios || PRECIOS[p.formato];
  return tabla && tabla[linea] ? tabla[linea] : null;
};
const pesos = (n) => '$ ' + n.toLocaleString('es-AR');
const lineaDe = (id) => LINEAS.find((l) => l.id === id);

// Actualiza precio y tiempo de entrega de una tarjeta según la versión elegida
const actualizarTarjeta = (card) => {
  const p = PRODUCTOS[card.dataset.i];
  const linea = card.dataset.linea;
  const precio = precioDe(p, linea);
  const priceEl = card.querySelector('.price');
  priceEl.textContent = precio ? pesos(precio) : 'Consultar precio';
  priceEl.classList.toggle('price--ask', !precio);
  const time = card.querySelector('.product__time');
  time.textContent = linea ? lineaDe(linea).entrega : '';
  time.hidden = !linea;
};

const productoHTML = (p, i) => {
  const img = p.foto
    ? `<img class="product__photo" src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy">`
    : `<i class="product__arch"></i>
       <div class="nb nb--${COLORES[i % 3]}" style="--w:160px;--h:220px;--r:${GIROS[i % 4]}deg;--t:20px" aria-hidden="true"><i class="nb__pages"></i><i class="nb__cover"></i><i class="nb__rings"></i><i class="nb__band"></i><div class="nb__label"><b>${esc(p.tapa)}</b><small>${esc(p.sub)}</small></div></div>`;
  const variantes = p.variantes && p.variantes.length
    ? `<div class="variants" role="group" aria-label="Elegí el modelo">${p.variantes
        .map((v, j) => `<button type="button" class="variant${j === 0 ? ' is-active' : ''}" aria-pressed="${j === 0}">${esc(v)}</button>`)
        .join('')}</div>`
    : '';
  const primera = (p.variantes && p.variantes[0]) || '';
  const lineas = p.sinLineas ? '' : `<div class="lines" role="group" aria-label="Elegí la versión">${LINEAS
    .map((l, j) => `<button type="button" class="line${j === 0 ? ' is-active' : ''}" data-linea="${l.id}" aria-pressed="${j === 0}">${esc(l.nombre)}</button>`)
    .join('')}</div>`;
  return `<article class="product card" data-i="${i}" data-linea="${p.sinLineas ? '' : LINEAS[0].id}" data-variante="${esc(primera)}">
    <div class="product__img">
      ${img}
      <span class="tag">${p.nuevo ? 'NUEVO' : esc(catName(p.cat).toUpperCase())}</span>
      <button type="button" class="fav" aria-label="Guardar ${esc(p.nombre)} en favoritos" aria-pressed="false"><svg class="ic"><use href="#i-heart"/></svg></button>
    </div>
    <div class="product__body">
      <h3 class="display">${esc(p.nombre)}</h3>
      <p>${esc(p.desc)}</p>
      ${variantes}
      ${lineas}
      <p class="product__time"></p>
      <div class="product__foot">
        <span class="price"></span>
        <button type="button" class="btn btn--primary btn--sm" data-add><svg class="ic"><use href="#i-bag"/></svg><span>Agregar</span></button>
      </div>
    </div>
  </article>`;
};

// Comparación Econo vs Premium (sale de LINEAS en catalogo.js)
document.querySelector('[data-compare]').innerHTML = LINEAS.map((l, j) => `
  <div class="compare__card${j === LINEAS.length - 1 ? ' compare__card--top' : ''}">
    <div class="compare__head">
      <p class="compare__name display">${esc(l.nombre)}</p>
      ${j === LINEAS.length - 1 ? '<span class="compare__badge">Más completa</span>' : ''}
    </div>
    <p class="compare__time">${esc(l.entrega)}</p>
    <ul class="compare__list">${l.incluye.map((x) => `<li><svg class="ic ic--16"><use href="#i-check"/></svg>${esc(x)}</li>`).join('')}</ul>
  </div>`).join('');

const filtersEl = document.querySelector('[data-filters]');
const productsEl = document.querySelector('[data-products]');
const moreBtn = document.querySelector('[data-more]');
let filtroActual = 'todos';
let expandido = false;

filtersEl.innerHTML = [{ id: 'todos', nombre: 'Todos' }, ...CATEGORIAS]
  .map((c) => `<button type="button" class="chip${c.id === 'todos' ? ' is-active' : ''}" data-filter="${c.id}" aria-pressed="${c.id === 'todos'}">${esc(c.nombre)}</button>`)
  .join('');

const render = () => {
  const lista = PRODUCTOS.map((p, i) => ({ p, i })).filter(({ p }) => filtroActual === 'todos' || p.cat === filtroActual);
  const recortar = filtroActual === 'todos' && !expandido && lista.length > TODOS_VISIBLES;
  const visibles = recortar ? lista.slice(0, TODOS_VISIBLES) : lista;
  productsEl.innerHTML = visibles.map(({ p, i }) => productoHTML(p, i)).join('');
  productsEl.querySelectorAll('.product').forEach(actualizarTarjeta);
  moreBtn.hidden = !recortar;
  filtersEl.querySelectorAll('.chip').forEach((c) => {
    const activo = c.dataset.filter === filtroActual;
    c.classList.toggle('is-active', activo);
    c.setAttribute('aria-pressed', String(activo));
  });
};

const aplicarFiltro = (cat) => { filtroActual = cat; expandido = false; render(); };
filtersEl.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (chip) aplicarFiltro(chip.dataset.filter);
});
document.querySelectorAll('[data-filter-link]').forEach((a) =>
  a.addEventListener('click', () => aplicarFiltro(a.dataset.filterLink))
);
moreBtn.addEventListener('click', () => { expandido = true; render(); });

// ---------- Carrito (se guarda en el navegador de la clienta) ----------
const CART_KEY = 'aya-carrito';
const cartDialog = document.querySelector('[data-cart]');
const cartItemsEl = cartDialog.querySelector('[data-cart-items]');
const cartForm = cartDialog.querySelector('[data-cart-form]');
const cartCountEls = document.querySelectorAll('[data-cart-count]');
const toastEl = document.querySelector('[data-toast]');

const leerCarrito = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    // descarta productos que ya no existen en el catálogo
    return Array.isArray(guardado) ? guardado.filter((it) => PRODUCTOS.some((p) => p.nombre === it.nombre) && (!it.linea || lineaDe(it.linea)) && it.cant > 0) : [];
  } catch (e) { return []; }
};
let carrito = leerCarrito();
const guardarCarrito = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ } };

const productoPorNombre = (nombre) => PRODUCTOS.find((p) => p.nombre === nombre);
const cantidadTotal = () => carrito.reduce((n, it) => n + it.cant, 0);
const itemTexto = (it) => [it.variante, it.linea && lineaDe(it.linea).nombre].filter(Boolean).join(' · ');

const agregarAlCarrito = (nombre, variante, linea) => {
  const existente = carrito.find((it) => it.nombre === nombre && it.variante === variante && it.linea === linea);
  if (existente) existente.cant += 1;
  else carrito.push({ nombre, variante, linea, cant: 1 });
  guardarCarrito();
  renderCarrito();
};

const renderCarrito = () => {
  const total = cantidadTotal();
  cartCountEls.forEach((el) => { el.textContent = total; el.hidden = total === 0; });
  document.querySelectorAll('[data-cart-open]').forEach((b) =>
    b.setAttribute('aria-label', `Ver mi pedido (${total} ${total === 1 ? 'producto' : 'productos'})`)
  );
  cartDialog.querySelector('[data-cart-empty]').hidden = total > 0;
  cartDialog.querySelectorAll('[data-cart-filled]').forEach((el) => { el.hidden = total === 0; });

  let suma = 0;
  let aConsultar = 0;
  cartItemsEl.innerHTML = carrito.map((it, idx) => {
    const precio = precioDe(productoPorNombre(it.nombre), it.linea);
    if (precio) suma += precio * it.cant; else aConsultar += 1;
    return `<li class="cart-item">
      <div class="cart-item__info">
        <p class="cart-item__name">${esc(it.nombre)}</p>
        <p class="cart-item__meta">${esc(itemTexto(it))}</p>
        <p class="cart-item__price">${precio ? pesos(precio * it.cant) : 'Precio a consultar'}</p>
      </div>
      <div class="cart-item__actions">
        <div class="qty">
          <button type="button" class="qty__btn" data-qty="-1" data-idx="${idx}" aria-label="Quitar uno de ${esc(it.nombre)}"><svg class="ic ic--16"><use href="#i-minus"/></svg></button>
          <span class="qty__n" aria-live="polite">${it.cant}</span>
          <button type="button" class="qty__btn" data-qty="1" data-idx="${idx}" aria-label="Sumar uno de ${esc(it.nombre)}"><svg class="ic ic--16"><use href="#i-plus"/></svg></button>
        </div>
        <button type="button" class="cart-item__remove" data-remove="${idx}" aria-label="Sacar ${esc(it.nombre)} del pedido"><svg class="ic ic--18"><use href="#i-trash"/></svg></button>
      </div>
    </li>`;
  }).join('');

  cartDialog.querySelector('[data-cart-total]').textContent = pesos(suma);
  const nota = cartDialog.querySelector('[data-cart-note]');
  nota.hidden = aConsultar === 0;
  nota.textContent = aConsultar === 1
    ? '+ 1 producto con precio a consultar'
    : `+ ${aConsultar} productos con precio a consultar`;
};

const mensajePedido = () => {
  const datos = new FormData(cartForm);
  let suma = 0;
  let aConsultar = false;
  const lineas = carrito.map((it, n) => {
    const precio = precioDe(productoPorNombre(it.nombre), it.linea);
    if (precio) suma += precio * it.cant; else aConsultar = true;
    return `${n + 1}. ${it.nombre} – ${itemTexto(it)} – x${it.cant} – ${precio ? pesos(precio * it.cant) : 'precio a consultar'}`;
  });
  const partes = ['Hola! Quiero hacer este pedido:', '', ...lineas, '',
    `Total: ${pesos(suma)}${aConsultar ? ' (+ productos a consultar)' : ''}`];
  const nombre = (datos.get('nombre') || '').trim();
  const entrega = datos.get('entrega');
  const tapas = (datos.get('tapas') || '').trim();
  if (nombre) partes.push(`Nombre: ${nombre}`);
  if (entrega) partes.push(`Entrega: ${entrega}`);
  if (tapas) partes.push(`Para las tapas: ${tapas}`);
  partes.push('', '¡Gracias!');
  return partes.join('\n');
};

let ultimoFoco = null;
const abrirCarrito = () => {
  ultimoFoco = document.activeElement;
  setMenu(false);
  renderCarrito();
  cartDialog.showModal();
  document.documentElement.classList.add('cart-open');
};
const cerrarCarrito = () => cartDialog.close();
cartDialog.addEventListener('close', () => {
  document.documentElement.classList.remove('cart-open');
  if (ultimoFoco) ultimoFoco.focus();
});
document.querySelectorAll('[data-cart-open]').forEach((b) => b.addEventListener('click', abrirCarrito));
cartDialog.addEventListener('click', (e) => {
  if (e.target === cartDialog || e.target.closest('[data-cart-close]')) { cerrarCarrito(); return; }
  const q = e.target.closest('[data-qty]');
  if (q) {
    const it = carrito[q.dataset.idx];
    it.cant += Number(q.dataset.qty);
    if (it.cant < 1) carrito.splice(q.dataset.idx, 1);
  }
  const r = e.target.closest('[data-remove]');
  if (r) carrito.splice(r.dataset.remove, 1);
  if (e.target.closest('[data-cart-clear]')) carrito = [];
  if (q || r || e.target.closest('[data-cart-clear]')) { guardarCarrito(); renderCarrito(); }
});
cartForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!carrito.length) return;
  window.open(waLink(mensajePedido()), '_blank', 'noopener');
});

let toastTimer;
const mostrarToast = (texto) => {
  toastEl.querySelector('[data-toast-text]').textContent = texto;
  toastEl.hidden = false;
  requestAnimationFrame(() => toastEl.classList.add('is-in'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('is-in');
    setTimeout(() => { toastEl.hidden = true; }, 300);
  }, 3500);
};

renderCarrito();

// Variantes, versión, favoritos y "Agregar" dentro de las tarjetas
productsEl.addEventListener('click', (e) => {
  const fav = e.target.closest('.fav');
  if (fav) {
    fav.setAttribute('aria-pressed', String(fav.getAttribute('aria-pressed') !== 'true'));
    return;
  }
  const add = e.target.closest('[data-add]');
  if (add) {
    const card = add.closest('.product');
    const p = PRODUCTOS[card.dataset.i];
    agregarAlCarrito(p.nombre, card.dataset.variante, card.dataset.linea);
    const label = add.querySelector('span');
    label.textContent = '¡Agregado!';
    setTimeout(() => { label.textContent = 'Agregar'; }, 1500);
    const detalle = itemTexto({ variante: card.dataset.variante, linea: card.dataset.linea });
    mostrarToast(detalle ? `${p.nombre} (${detalle})` : p.nombre);
    return;
  }
  const btn = e.target.closest('.variant, .line');
  if (!btn) return;
  const card = btn.closest('.product');
  const grupo = btn.classList.contains('line') ? '.line' : '.variant';
  card.querySelectorAll(grupo).forEach((b) => {
    b.classList.toggle('is-active', b === btn);
    b.setAttribute('aria-pressed', String(b === btn));
  });
  if (grupo === '.line') card.dataset.linea = btn.dataset.linea;
  else card.dataset.variante = btn.textContent;
  actualizarTarjeta(card);
});

render();

// Presupuesto para empresas → WhatsApp
const bizForm = document.querySelector('[data-biz-form]');
bizForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(bizForm);
  const val = (k) => (d.get(k) || '').toString().trim();
  const partes = ['Hola! Quiero pedir un presupuesto para empresa.', ''];
  if (val('empresa')) partes.push(`Empresa: ${val('empresa')}`);
  partes.push(`Producto: ${val('producto')}`);
  if (val('cantidad')) partes.push(`Cantidad aproximada: ${val('cantidad')}`);
  if (val('fecha')) partes.push(`Para cuándo: ${val('fecha')}`);
  partes.push('', 'Quisiera personalizar las tapas con nuestro logo. ¡Gracias!');
  window.open(waLink(partes.join('\n')), '_blank', 'noopener');
});

// Preguntas frecuentes: una abierta por vez
const faqs = document.querySelectorAll('.qa');
faqs.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
}));

// Aparición suave de secciones al hacer scroll
if ('IntersectionObserver' in window) {
  const items = document.querySelectorAll('.cat, .step, .feature, .review, .qa, .final__box, .biz__box, .sec-head');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
}

document.getElementById('year').textContent = new Date().getFullYear();
