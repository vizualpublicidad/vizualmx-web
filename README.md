# Vizual Publicidad — Web Demo

Sitio estático listo para desplegar en Vercel desde GitHub.

## Archivos
- `index.html` — estructura y contenido
- `styles.css` — diseño responsive
- `script.js` — animaciones y modal de showreel
- `assets/` — logotipos
- `vercel.json` — configuración mínima para Vercel

## Personalización rápida
1. Sustituye enlaces de proyectos en la sección `#trabajos`.
2. Sustituye los nombres de la sección `#clientes` por `<img>` con logos reales.
3. Cambia correo/redes en `#contacto`.
4. Si tienes un showreel, reemplaza el contenido del modal por un `<iframe>` de YouTube/Vimeo o `<video>` MP4.

## Deploy
Sube esta carpeta a un repositorio de GitHub y conéctalo a Vercel como proyecto estático.


## Actualización V2
- Sección de servicios rediseñada con estética neon similar al mockup aprobado.
- Sección de clientes actualizada con los logotipos proporcionados.

## Clínicas y WhatsApp
- `#clinicas` presenta la app y conecta a WhatsApp con un mensaje de demo precargado.
- Para añadir capturas reales, sustituye el contenido de `.clinic-visual` en `index.html`; conserva el contenedor responsive y añade textos alternativos a las imágenes.
- El diálogo aparece a los 12 segundos o al recorrer el 45% de la página, lo que ocurra primero. `sessionStorage` evita repetirlo en la misma sesión de pestaña. Si el almacenamiento está bloqueado, se limita a una vez por carga.
- El botón de cierre, Escape y el fondo permiten cerrar el diálogo. Solicitar una demo también cancela la invitación automática. El diálogo nativo mantiene el foco y el cierre lo restaura.
- No se añaden dependencias, servicios externos ni cambios a la configuración de despliegue.
