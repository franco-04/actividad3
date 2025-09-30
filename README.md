# ACTIVIDAD 3

## ¿Qué hice?
Implementw un **App Shell** funcional como **PWA** con:
- Estructura: encabezado, menú principal, pie de página y al menos una vista dinámica.
- **Service Worker** que cachea el App Shell y permite funcionamiento sin conexión.
- **Archivo de manifiesto** con íconos, nombre y colores.
- **Contenido dinámico** simulado con lista de tareas offline y noticias por fetch.

---

## ¿Qué utilice?
- **React + Vite**
- **vite-plugin-pwa** para generar el Service Worker y el manifest
- **Workbox** incluido en el plugin, estrategias de caché
- **localStorage** para persistir tareas sin conexión

---

## Configuración 
- **Íconos**: SE usan `icon-128.png` y `icon-192.png`.
- **Service Worker**:
  - Precarga App Shell y recursos estáticos.
  - Fallback a `offline.html` cuando no hay red.
- **Manifest**:
  - Nombre: `App Shell Demo`
  - short_name: `AppShell`
  - Colores: `theme_color: #0ea5e9`, `background_color: #ffffff`
  - Íconos declarados: 128x128 y 192x192

---

## ¿Comó lo corro?

### Modo desarrollo (sin Service Worker)
```bash
npm install
npm run dev
```
### Modo producción (con Service Worker)
```bash
npm run build
npm run preview
```

## Prueba sin conexión
1. Abre la app con `npm run preview`.
2. Navega a las vistas **Tareas** y **Noticias** para que se cacheen.
3. En DevTools → pestaña **Application → Service Workers**, activa la casilla **Offline**.
4. Recarga la página:
   - El App Shell (header, menú, footer) sigue cargando.
   - **Tareas** funciona siempre (localStorage).
   - **Noticias** se servirán desde caché si ya habías cargado esa vista antes

---

## Arquitectura
- **App Shell**: `App.jsx` (header, menú, footer).
- **Contenido dinámico**:
  - *Tareas*: se guardan en `localStorage`.
  - *Noticias*: se consultan vía `fetch` a JSONPlaceholder, pero quedan en caché
- **Service Worker**: generado automáticamente por `vite-plugin-pwa`.
- **Manifest**: `public/manifest.webmanifest` + íconos (128, 192 px).

---
