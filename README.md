# Omora — sitio web

Sitio web de una sola página para mostrar las carteras y accesorios tejidos a
mano de **Omora**. Hecho con [Astro](https://astro.build) (sitio estático) y
servido con **[Caddy](https://caddyserver.com)** dentro de un contenedor Docker.

**En producción:** https://omora.alfredsensual.com

> El contenedor sirve el sitio como HTTP simple en `127.0.0.1:8092`. El dominio
> y el HTTPS los maneja el reverse proxy que ya existe en el droplet (el mismo
> que sirve `managementdoral.alfredsensual.com`).

---

## 1. Desarrollo local

Requiere [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:4321
npm run build    # genera el sitio en  dist/
npm run preview  # previsualiza la versión de producción
```

---

## 2. Cómo personalizar el sitio

Todo lo editable está en `src/data/`.

### Número de WhatsApp  ← **importante**
Archivo: `src/data/site.ts`

```ts
whatsapp: '56900000000',  // ← reemplazar por el número real
```

Código de país + número, **solo dígitos** (sin `+`, espacios ni guiones).
Ejemplo para Chile: `56912345678`. Todos los botones de WhatsApp usan este valor.

### Catálogo de carteras
Archivo: `src/data/purses.ts` — cada cartera es un bloque con `name`,
`description`, `price` (en CLP, solo el número), `category` e `image`.

### Agregar fotos reales
1. Copia la foto en `public/images/purses/` (ej: `cartera-ejemplo.jpg`).
2. En `purses.ts`, pon la ruta en `image`: `'/images/purses/cartera-ejemplo.jpg'`.

Mientras `image` esté vacío se muestra un marcador "Foto próximamente".

### Texto "Sobre Omora"
Archivo: `src/components/About.astro` — busca los comentarios `EDITABLE`.

---

## 3. Probar el contenedor en local (opcional)

Requiere Docker Desktop corriendo:

```bash
docker compose up --build
# luego abre http://localhost:8092
```

---

## 4. Despliegue en omora.alfredsensual.com

El sitio se publica en el **mismo droplet** de DigitalOcean que ya aloja
`managementdoral.alfredsensual.com`. El contenedor de Omora solo escucha en
`127.0.0.1:8092` (HTTP local, no público); el reverse proxy que ya existe en el
droplet se encarga del dominio y del certificado HTTPS.

### Paso 1 — DNS en GoDaddy
GoDaddy → `alfredsensual.com` → DNS → nuevo registro:

| Tipo | Nombre  | Valor (Datos)                  | TTL     |
|------|---------|--------------------------------|---------|
| A    | `omora` | *IP del droplet* (la misma que `managementdoral`) | 600 seg |

### Paso 2 — Subir el sitio a GitHub
1. Crea un repositorio **privado** vacío en https://github.com/new
   (nombre sugerido: `omora-website`, sin README ni .gitignore).
2. En tu PC, dentro de la carpeta del proyecto:

   ```bash
   git remote add origin https://github.com/elalfredsensual/omora-website.git
   git push -u origin main
   ```

### Paso 3 — En el droplet: levantar el contenedor
```bash
git clone https://github.com/elalfredsensual/omora-website.git /opt/omora
cd /opt/omora
docker compose up -d --build
curl -I http://127.0.0.1:8092      # debe responder "HTTP/1.1 200 OK"
```
No hace falta abrir puertos en el firewall: `8092` es solo local.

### Paso 4 — Agregar la ruta en el reverse proxy existente
Hay que agregar al reverse proxy del droplet una entrada nueva:

```
omora.alfredsensual.com  →  http://127.0.0.1:8092   (con HTTPS)
```

Los comandos exactos dependen de qué reverse proxy esté en uso (nginx + certbot,
Caddy, Nginx Proxy Manager, Traefik…). **El despliegue de Superset no se toca.**

### Paso 5 — Verificar
Abre **https://omora.alfredsensual.com** (debe cargar con candado HTTPS).

### Actualizar el sitio publicado
```bash
# en tu PC
git add -A && git commit -m "Actualiza contenido" && git push

# en el droplet
cd /opt/omora && git pull && docker compose up -d --build
```

---

## Estructura del proyecto

```
├─ public/images/      logos, favicon, fotos de carteras
├─ src/
│  ├─ data/            site.ts (config) · purses.ts (catálogo)
│  ├─ components/      secciones de la página
│  ├─ layouts/         plantilla base (HTML, SEO)
│  ├─ pages/index.astro  la página única
│  └─ styles/          estilos globales y tokens de diseño
├─ Dockerfile          build (Node) → servir con Caddy
├─ Caddyfile           servidor estático en el puerto 80 del contenedor
└─ docker-compose.yml  publica el sitio en 127.0.0.1:8092
```
