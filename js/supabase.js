/**
 * Fachada de datos.
 * Si existe js/config.js con URL y anon key, consulta Supabase.
 * Si el archivo no está, las claves vienen vacías o la red falla,
 * devuelve los datos de ejemplo. La interfaz no debe enterarse.
 */
import { mesas as mesasEjemplo, platos as platosEjemplo } from './datos-ejemplo.js';

const SDK_SUPABASE = 'https://esm.sh/@supabase/supabase-js@2';

/** Una sola promesa para no intentar cargar la config dos veces. */
let clientePromesa = null;

function configuracionValida(url, clave) {
  if (!url || !clave) return false;

  try {
    const analizada = new URL(url);
    return analizada.protocol === 'https:' || analizada.protocol === 'http:';
  } catch {
    return false;
  }
}

async function crearCliente() {
  let configuracion;

  try {
    configuracion = await import('./config.js');
  } catch {
    return null;
  }

  const url = typeof configuracion.SUPABASE_URL === 'string'
    ? configuracion.SUPABASE_URL.trim()
    : '';
  const clave = typeof configuracion.SUPABASE_ANON_KEY === 'string'
    ? configuracion.SUPABASE_ANON_KEY.trim()
    : '';

  if (!configuracionValida(url, clave)) return null;

  try {
    const { createClient } = await import(SDK_SUPABASE);
    return createClient(url, clave);
  } catch {
    return null;
  }
}

function obtenerCliente() {
  if (!clientePromesa) {
    clientePromesa = crearCliente();
  }

  return clientePromesa;
}

async function consultarTabla(tabla) {
  try {
    const cliente = await obtenerCliente();
    if (!cliente) return null;

    const { data, error } = await cliente.from(tabla).select('*');
    if (error || !Array.isArray(data)) return null;

    return data;
  } catch {
    return null;
  }
}

export async function obtenerMesas() {
  const datos = await consultarTabla('mesas');
  return datos ?? mesasEjemplo;
}

export async function obtenerPlatos() {
  const datos = await consultarTabla('platos');
  return datos ?? platosEjemplo;
}
