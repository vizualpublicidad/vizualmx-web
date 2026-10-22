# VIZUAL Business Solutions

Rebranding del sitio estático existente, preparado el 22 de octubre de 2026.

## Páginas

- `/`: portada comercial con las tres soluciones, capacidades secundarias, clientes y trabajo existente.
- `/operaciones`: VIZUAL Operations; sistemas empresariales modulares y solicitud de diagnóstico.
- `/sistema-para-clinicas`: VIZUAL Clinic; app para pacientes + dashboard, conservando citas, pacientes, agenda y chat.
- `/business-experience`: VIZUAL Business Experience; marca y experiencia digital corporativa.

## Publicación

Esta carpeta es la raíz del sitio. Mantener el proyecto estático existente en Vercel, sin framework ni compilación; publicar el contenido completo con `assets/`, HTML, CSS, JavaScript, robots.txt, sitemap.xml y vercel.json. Se conserva `cleanUrls: true` y la URL existente de clínicas. Los enlaces sin extensión requieren ese servidor; para revisar localmente usar un servidor que resuelva `/operaciones` a `operaciones.html`.

La entrega no publica cambios ni modifica el repositorio remoto. `vizualmx-empresas` es una variante local anterior y no es la carpeta de esta entrega. No se modificaron archivos de `sources/`.

## Identidad

Wordmark oficial proporcionado por el usuario: `assets/vizual-business-solutions.png` (1200 × 226, PNG con transparencia). Se conserva el archivo exacto, sin recortar ni reinterpretar, y se muestra con proporción natural en encabezado y pie de las cuatro páginas. El favicon continúa como una V tipográfica simple.

Brand · Technology · Growth aparece únicamente en capacidades secundarias. Los logos y videos antiguos se conservan como archivos de legado, pero el hero ya no carga la animación con la identidad anterior. Las imágenes sociales anteriores no se referencian; la nueva tarjeta es `assets/social/business-solutions.png`.

## Contenido y conversión

- Problema → solución → alcance → CTA; rutas y mensajes de WhatsApp por interés.
- WhatsApp: +52 686 199 2711. Correo: contacto@vizualmx.com.
- Operations se presenta como sistema modular cuyo alcance se acuerda, sin inventar integraciones, automatizaciones ni disponibilidad de módulos no demostrados.
- Clinic conserva funciones y material visual existentes, sin añadir facturación, reportes ni métricas.
- Conservados logos de clientes y videos existentes; Datómico sigue identificado como proyecto independiente del fundador.
- Retirados cifras no respaldadas, proyecto Cafecito de muestra, showreel vacío y popup automático.
- Social Media deja de ser una oferta principal. Branding, web, apps, dashboards, sistemas y Growth son capacidades que respaldan las soluciones.

## SEO y medición

Títulos y descripciones por página, canonical, Open Graph, Twitter, Organization/WebSite/WebPage/Service y sitemap actualizados. Sin métricas, reseñas ni resultados inventados.

Se conserva `analytics.js`: GA4 sigue desactivado hasta disponer del ID real del propietario. `whatsapp_click` identifica diagnóstico/proyecto; `demo_click`, demo de Clinic; `email_click`, correo. `interest` distingue `business`, `operations`, `clinics` y `experience`. Los clics representan intención, no leads confirmados. Se mantiene respeto a DNT/GPC y activación solo en el dominio de producción.

## Verificación

- Cuatro páginas comprobadas en navegador con anchos de viewport de 320, 390, 768 y 1280 px: sin desbordamientos horizontales en el contenido.
- Menú móvil abre, muestra las rutas y permite navegar a Operations.
- Navegación a Clinic y apertura de su video real en diálogo verificadas.
- Enlaces locales, archivos referenciados y anclas existentes; un H1 y ningún ID duplicado por página; JSON-LD válido.
- JavaScript pasa revisión de sintaxis; sin errores ni advertencias en la consola revisada de portada.
- Los CTA de WhatsApp/correo se validaron por destino; no se enviaron mensajes.
- No hay backend nuevo, formularios ni servicios adicionales que configurar.

Los archivos previos a esta intervención están respaldados fuera del sitio, en `entregables/rebranding-respaldo/`.
