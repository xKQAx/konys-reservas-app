/**
 * Página principal del cliente.
 * Solo pide datos a obtenerMesas() y obtenerPlatos(): da igual si vienen
 * de Supabase o de los datos de ejemplo.
 */
import { obtenerMesas, obtenerPlatos } from './supabase.js';

const NOMBRES_ZONA = {
  terraza: 'Terraza',
  salon: 'Salón',
};

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const estado = {
  mesas: [],
  platos: [],
  zona: 'todas',
  categoria: 'pizzas',
  listo: false,
};

const nodos = {
  listaMesas: document.querySelector('#lista-mesas'),
  listaPlatos: document.querySelector('#lista-platos'),
  vacioMesas: document.querySelector('#vacio-mesas'),
  vacioPlatos: document.querySelector('#vacio-platos'),
  anuncioMesas: document.querySelector('#anuncio-mesas'),
  anuncioPlatos: document.querySelector('#anuncio-platos'),
  filtrosMesas: document.querySelector('#filtros-mesas'),
  filtrosCarta: document.querySelector('#filtros-carta'),
  botonMenu: document.querySelector('#boton-menu'),
  menu: document.querySelector('#menu-principal'),
};

/**
 * Misma pieza para los dos grupos de pastillas: mesas por zona y carta por categoría.
 * El botón activo queda marcado con aria-pressed para lectores de pantalla.
 */
function iniciarFiltros(contenedor, alCambiar) {
  if (!contenedor) return;

  const botones = [...contenedor.querySelectorAll('.filtro')];

  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.filtro');
    if (!boton || !contenedor.contains(boton)) return;

    botones.forEach((item) => {
      const activo = item === boton;
      item.classList.toggle('is-activo', activo);
      item.setAttribute('aria-pressed', String(activo));
    });

    alCambiar(boton.dataset.valor);
  });
}

function abrirMenu() {
  nodos.menu.classList.add('is-abierto');
  nodos.botonMenu.classList.add('is-abierto');
  nodos.botonMenu.setAttribute('aria-expanded', 'true');
  nodos.botonMenu.setAttribute('aria-label', 'Cerrar menú');
  nodos.menu.querySelector('a')?.focus();
}

function cerrarMenu(devolverFoco) {
  nodos.menu.classList.remove('is-abierto');
  nodos.botonMenu.classList.remove('is-abierto');
  nodos.botonMenu.setAttribute('aria-expanded', 'false');
  nodos.botonMenu.setAttribute('aria-label', 'Abrir menú');

  if (devolverFoco) nodos.botonMenu.focus();
}

function menuAbierto() {
  return nodos.botonMenu.getAttribute('aria-expanded') === 'true';
}

function iniciarMenu() {
  if (!nodos.botonMenu || !nodos.menu) return;

  nodos.botonMenu.addEventListener('click', () => {
    if (menuAbierto()) cerrarMenu(false);
    else abrirMenu();
  });

  nodos.menu.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) cerrarMenu(false);
  });

  document.addEventListener('click', (evento) => {
    if (!menuAbierto()) return;
    if (nodos.menu.contains(evento.target) || nodos.botonMenu.contains(evento.target)) return;
    cerrarMenu(false);
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menuAbierto()) cerrarMenu(true);
  });

  const escritorio = window.matchMedia('(min-width: 880px)');
  const alCambiarAncho = (consulta) => {
    if (consulta.matches) cerrarMenu(false);
  };

  if (typeof escritorio.addEventListener === 'function') {
    escritorio.addEventListener('change', alCambiarAncho);
  } else {
    escritorio.addListener(alCambiarAncho);
  }
}

function clonarIcono(id) {
  const plantilla = document.getElementById(id);
  if (!plantilla?.content.firstElementChild) return document.createElement('span');
  return plantilla.content.firstElementChild.cloneNode(true);
}

function esUrlDeFoto(valor) {
  if (typeof valor !== 'string') return false;
  const url = valor.trim();
  if (!url) return false;
  if (/^https?:\/\//i.test(url)) return true;
  return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
}

function textoZona(zona) {
  if (NOMBRES_ZONA[zona]) return NOMBRES_ZONA[zona];
  return typeof zona === 'string' && zona ? zona : 'Zona';
}

function textoCapacidad(valor) {
  const cantidad = Number(valor);
  if (!Number.isFinite(cantidad)) return 'Capacidad no indicada';
  const personas = cantidad === 1 ? 'persona' : 'personas';
  return `Capacidad: ${cantidad} ${personas}`;
}

function datosEstado(valor) {
  if (valor === 'libre') {
    return { clase: 'chip-estado--libre', texto: 'Libre', libre: true };
  }

  if (valor === 'ocupada') {
    return { clase: 'chip-estado--ocupada', texto: 'Ocupada', libre: false };
  }

  return { clase: 'chip-estado--otro', texto: 'Sin estado', libre: false };
}

/**
 * El flujo de reserva todavía no existe. Quien lo arme escucha este evento
 * y lee el id en evento.detail.id.
 */
function solicitarReserva(id) {
  document.dispatchEvent(new CustomEvent('konys:abrir-reserva', {
    bubbles: true,
    detail: { id },
  }));
}

function crearTarjetaMesa(mesa) {
  const infoEstado = datosEstado(mesa.estado);
  const articulo = document.createElement('article');
  articulo.className = 'tarjeta-mesa';
  articulo.dataset.id = String(mesa.id);

  const foto = document.createElement('div');
  foto.className = 'tarjeta-mesa-foto';
  foto.classList.add(mesa.zona === 'terraza'
    ? 'tarjeta-mesa-foto--terraza'
    : 'tarjeta-mesa-foto--salon');

  const chipZona = document.createElement('span');
  chipZona.className = 'chip-zona';
  chipZona.textContent = textoZona(mesa.zona);
  foto.append(chipZona);

  if (esUrlDeFoto(mesa.foto_url)) {
    const imagen = document.createElement('img');
    imagen.src = mesa.foto_url.trim();
    imagen.alt = `Foto de ${mesa.nombre}`;
    imagen.addEventListener('error', () => {
      imagen.remove();
      foto.append(clonarIcono('plantilla-icono-mesa'));
    });
    foto.append(imagen);
  } else {
    foto.append(clonarIcono('plantilla-icono-mesa'));
  }

  const cuerpo = document.createElement('div');
  cuerpo.className = 'tarjeta-mesa-cuerpo';

  const encabezado = document.createElement('div');
  encabezado.className = 'tarjeta-mesa-encabezado';

  const titulo = document.createElement('h3');
  titulo.textContent = mesa.nombre ?? 'Mesa';

  const chipEstado = document.createElement('span');
  chipEstado.className = `chip-estado ${infoEstado.clase}`;
  chipEstado.textContent = infoEstado.texto;

  encabezado.append(titulo, chipEstado);

  const capacidad = document.createElement('p');
  capacidad.className = 'texto-pequeno';
  capacidad.textContent = textoCapacidad(mesa.capacidad);

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = infoEstado.libre ? 'boton boton-primario' : 'boton boton-secundario';
  boton.textContent = 'Ver horarios';
  boton.setAttribute('aria-label', `Ver horarios de ${mesa.nombre ?? 'la mesa'}`);
  boton.addEventListener('click', () => solicitarReserva(mesa.id));

  cuerpo.append(encabezado, capacidad, boton);
  articulo.append(foto, cuerpo);
  return articulo;
}

function crearTarjetaPlato(plato) {
  const articulo = document.createElement('article');
  articulo.className = 'tarjeta-plato';
  articulo.dataset.id = String(plato.id);

  const icono = document.createElement('div');
  icono.className = 'plato-icono';
  icono.setAttribute('aria-hidden', 'true');
  icono.append(clonarIcono('plantilla-cono'));

  const texto = document.createElement('div');
  texto.className = 'plato-texto';

  const titulo = document.createElement('h3');
  titulo.textContent = plato.nombre ?? 'Plato';

  const descripcion = document.createElement('p');
  descripcion.className = 'texto-pequeno';
  descripcion.textContent = plato.descripcion ?? '';

  texto.append(titulo, descripcion);

  const precio = document.createElement('p');
  precio.className = 'plato-precio';
  const valor = Number(plato.precio);
  precio.textContent = Number.isFinite(valor) ? formatoCOP.format(valor) : '';

  articulo.append(icono, texto, precio);
  return articulo;
}

function ordenarPorId(lista) {
  return [...lista].sort((a, b) => String(a.id).localeCompare(String(b.id), 'es', {
    numeric: true,
  }));
}

function pintarLista(lista, vacio, anuncio, elementos, mensajeVacio, mensajeConteo) {
  if (elementos.length === 0) {
    lista.replaceChildren();
    lista.hidden = true;
    vacio.hidden = false;
    vacio.classList.add('esta-vacio');
    vacio.textContent = mensajeVacio;
    anuncio.textContent = mensajeVacio;
    return;
  }

  lista.replaceChildren(...elementos);
  lista.hidden = false;
  vacio.hidden = true;
  vacio.classList.remove('esta-vacio');
  anuncio.textContent = mensajeConteo;
}

function renderizarMesas() {
  if (!estado.listo || !nodos.listaMesas) return;

  const activas = estado.mesas.filter((mesa) => mesa.activa === true);
  const visibles = ordenarPorId(activas.filter((mesa) => (
    estado.zona === 'todas' || mesa.zona === estado.zona
  )));

  const mensajeVacio = activas.length === 0
    ? 'No hay mesas activas por ahora.'
    : 'No hay mesas en esta zona.';
  const mensajeConteo = visibles.length === 1
    ? 'Se muestra 1 mesa.'
    : `Se muestran ${visibles.length} mesas.`;

  const tarjetas = visibles.map((mesa) => {
    const item = document.createElement('li');
    item.append(crearTarjetaMesa(mesa));
    return item;
  });

  pintarLista(
    nodos.listaMesas,
    nodos.vacioMesas,
    nodos.anuncioMesas,
    tarjetas,
    mensajeVacio,
    mensajeConteo,
  );
  nodos.listaMesas.setAttribute('aria-busy', 'false');
}

function renderizarPlatos() {
  if (!estado.listo || !nodos.listaPlatos) return;

  const disponibles = estado.platos.filter((plato) => plato.disponible === true);
  const visibles = ordenarPorId(disponibles.filter((plato) => plato.categoria === estado.categoria));

  const mensajeVacio = disponibles.length === 0
    ? 'No hay platos disponibles por ahora.'
    : 'No hay platos en esta categoría.';
  const mensajeConteo = visibles.length === 1
    ? 'Se muestra 1 plato.'
    : `Se muestran ${visibles.length} platos.`;

  const tarjetas = visibles.map((plato) => {
    const item = document.createElement('li');
    item.append(crearTarjetaPlato(plato));
    return item;
  });

  pintarLista(
    nodos.listaPlatos,
    nodos.vacioPlatos,
    nodos.anuncioPlatos,
    tarjetas,
    mensajeVacio,
    mensajeConteo,
  );
  nodos.listaPlatos.setAttribute('aria-busy', 'false');
}

async function cargarDatos() {
  try {
    const [mesas, platos] = await Promise.all([obtenerMesas(), obtenerPlatos()]);
    estado.mesas = Array.isArray(mesas) ? mesas : [];
    estado.platos = Array.isArray(platos) ? platos : [];
  } catch {
    estado.mesas = [];
    estado.platos = [];
  }

  estado.listo = true;
  renderizarMesas();
  renderizarPlatos();
}

function iniciar() {
  if (!nodos.listaMesas || !nodos.listaPlatos) return;

  iniciarMenu();
  iniciarFiltros(nodos.filtrosMesas, (zona) => {
    estado.zona = zona;
    renderizarMesas();
  });
  iniciarFiltros(nodos.filtrosCarta, (categoria) => {
    estado.categoria = categoria;
    renderizarPlatos();
  });

  cargarDatos();
}

iniciar();
