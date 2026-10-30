# Konys Pizza — Reservas

Página principal del cliente para reservar mesa en Konys Pizza, pizzería de pizza en cono en Bucaramanga. Es un proyecto académico de Full Stack.

Esta entrega es solo el inicio: la página ya se ve y se filtra con datos de ejemplo, y queda lista para conectar Supabase sin cambiar la interfaz.

## Tecnologías

- HTML5 semántico
- CSS3 con variables, Flexbox y Grid (sin Bootstrap ni Tailwind)
- JavaScript moderno (ES6+) en módulos, sin React ni librerías de interfaz
- Supabase se conectará después con su SDK de JavaScript, cargado desde `esm.sh` solo si hay claves

## Cómo ejecutarlo

Los módulos no funcionan si abres `index.html` con doble clic (`file://`). Usa un servidor estático:

1. Extensión Live Server: clic derecho en `index.html` → **Open with Live Server**.
2. En la carpeta del proyecto: `npx serve .` y abre la dirección que muestre la terminal.
3. O bien: `python -m http.server 5500` y abre [http://localhost:5500](http://localhost:5500).

No hace falta instalar dependencias ni usar un bundler.

## Estructura

```text
index.html              Página principal
css/styles.css          Estilos
js/cliente.js           Render y filtros de la página
js/datos-ejemplo.js     Mesas y platos de ejemplo
js/supabase.js          Conexión opcional a Supabase
js/config.example.js    Plantilla de claves (valores vacíos)
docs/                   Reservada para más adelante
```

## Supabase más adelante

1. Copia `js/config.example.js` como `js/config.js`.
2. Completa `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
3. Crea las tablas `mesas` y `platos` con las columnas que están en `js/datos-ejemplo.js`.
4. Recarga la página.

Si `js/config.js` no existe, las claves están vacías o la consulta falla, la página sigue mostrando los datos de ejemplo. `js/config.js` está en `.gitignore`: no subas claves ni archivos `.env`.

Sin ese archivo, la consola del navegador puede mostrar un 404 de `js/config.js`. No rompe la página: el módulo lo captura y usa los datos de ejemplo. Para quitar el aviso, copia `js/config.example.js` como `js/config.js` aunque dejes las claves vacías.

## Qué comprobar

- Los filtros **Todas**, **Terraza** y **Salón** cambian las mesas.
- Las pestañas **Pizzas**, **Entradas**, **Postres** y **Bebidas** cambian la carta.
- La Mesa 5 (inactiva) y la malteada de arequipe (`disponible: false`) no aparecen.
- **Ver horarios** dispara el evento `konys:abrir-reserva`. En la consola del navegador:

```javascript
document.addEventListener('konys:abrir-reserva', (evento) => {
  console.log(evento.detail.id);
});
```

El id viaja en `evento.detail.id`.
