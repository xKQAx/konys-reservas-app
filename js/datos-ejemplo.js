/**
 * Datos de ejemplo con la misma forma que tendrán las tablas de Supabase.
 * La página solo muestra mesas con activa = true y platos con disponible = true.
 * Mesa 5 y la malteada existen para comprobar esos filtros.
 * Las tres primeras pizzas son los platos de ejemplo del encargo.
 */

export const mesas = [
  {
    id: 1,
    nombre: 'Mesa 1',
    zona: 'terraza',
    capacidad: 4,
    activa: true,
    foto_url: null,
    estado: 'libre',
  },
  {
    id: 2,
    nombre: 'Mesa 2',
    zona: 'terraza',
    capacidad: 2,
    activa: true,
    foto_url: null,
    estado: 'libre',
  },
  {
    id: 3,
    nombre: 'Mesa 3',
    zona: 'salon',
    capacidad: 6,
    activa: true,
    foto_url: null,
    estado: 'ocupada',
  },
  {
    id: 4,
    nombre: 'Mesa 4',
    zona: 'salon',
    capacidad: 4,
    activa: true,
    foto_url: null,
    estado: 'libre',
  },
  {
    id: 5,
    nombre: 'Mesa 5',
    zona: 'salon',
    capacidad: 8,
    activa: false,
    foto_url: null,
    estado: 'libre',
  },
];

export const platos = [
  {
    id: 1,
    nombre: 'Cono Margarita',
    categoria: 'pizzas',
    descripcion: 'Salsa de tomate, mozzarella y albahaca fresca. Dato de ejemplo.',
    precio: 24900,
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Cono Pepperoni',
    categoria: 'pizzas',
    descripcion: 'Pepperoni, mozzarella y salsa de la casa. Dato de ejemplo.',
    precio: 28900,
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Cono Hawaiano',
    categoria: 'pizzas',
    descripcion: 'Jamón, piña y mozzarella. Dato de ejemplo.',
    precio: 27900,
    disponible: true,
  },
  {
    id: 4,
    nombre: 'Dedos de queso',
    categoria: 'entradas',
    descripcion: 'Mozzarella apanada con salsa de tomate.',
    precio: 14900,
    disponible: true,
  },
  {
    id: 5,
    nombre: 'Pan de ajo',
    categoria: 'entradas',
    descripcion: 'Pan horneado con ajo, perejil y mantequilla.',
    precio: 9900,
    disponible: true,
  },
  {
    id: 6,
    nombre: 'Brownie con helado',
    categoria: 'postres',
    descripcion: 'Brownie tibio de chocolate con helado de vainilla.',
    precio: 12900,
    disponible: true,
  },
  {
    id: 7,
    nombre: 'Volcán de chocolate',
    categoria: 'postres',
    descripcion: 'Bizcocho de chocolate con centro fundido.',
    precio: 13900,
    disponible: true,
  },
  {
    id: 8,
    nombre: 'Limonada de coco',
    categoria: 'bebidas',
    descripcion: 'Limonada natural con coco.',
    precio: 8000,
    disponible: true,
  },
  {
    id: 9,
    nombre: 'Jugo de mora',
    categoria: 'bebidas',
    descripcion: 'Jugo natural de mora, sin azúcar añadida.',
    precio: 7000,
    disponible: true,
  },
  {
    id: 10,
    nombre: 'Malteada de arequipe',
    categoria: 'bebidas',
    descripcion: 'Crema de arequipe con helado. No debe mostrarse.',
    precio: 11900,
    disponible: false,
  },
];
