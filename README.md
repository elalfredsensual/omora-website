# Omora — sitio web

Sitio web de una sola página para mostrar las carteras y accesorios tejidos a
mano de **Omora**. Hecho con [Astro](https://astro.build) (sitio estático) y
servido con **[Caddy](https://caddyserver.com)** dentro de un contenedor Docker
— Caddy entrega HTTPS automático sin configuración de certificados.

**En producción:** https://omora.alfredsensual.com

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
Para agregar una, copia un bloque y edita los campos.

### Agregar fotos reales
1. Copia la foto en `public/images/purses/` (ej: `cartera-ejemplo.jpg`).
2. En `purses.ts`, pon la ruta en `image`: `'/images/purses/cartera-ejemplo.jpg'`.

Mientras `image` esté vacío se muestra un marcador "Foto próximamente".

### Texto "Sobre Omora"
Archivo: `src/components/About.astro` — busca los comentarios `EDITABLE`.

---

## 3. Probar el contenedor en local (opcional)

Requiere Docker Desktop corriendo. `SITE_ADDRESS=:80` hace que Caddy sirva en
HTTP simple (sin intentar pedir un certificado para el dominio real):

```bash
# PowerShell
$env:SITE_ADDRESS=":80"; docker compose up --build
# luego abre http://localhost
```

---

## 4. Despliegue en omora.alfredsensual.com

El sitio se publica como un subdominio en el droplet de DigitalOcean, **sin
afectar el despliegue de Superset** (que sigue en el puerto 8091). Caddy ocupa
los puertos 80 y 443 y obtiene el certificado HTTPS automáticamente.

### Paso 1 — DNS en GoDaddy
En GoDaddy → *Mis productos* → `alfredsensual.com` → **DNS**, agrega un registro:

| Tipo | Nombre  | Valor (Datos)        | TTL       |
|------|---------|----------------------|-----------|
| A    | `omora` | *IP del droplet*     | 600 seg   |

Esto hace que `omora.alfredsensual.com` apunte al droplet. Espera a que propague
(`nslookup omora.alfredsensual.com` debe devolver la IP del droplet).

### Paso 2 — Subir el sitio a GitHub
1. Crea un repositorio **privado** vacío en https://github.com/new
   (sugerencia de nombre: `omora-website`, sin README ni .gitignore).
2. Desde tu PC, en la carpeta del proyecto:

   ```bash
   git remote add origin https://github.com/elalfredsensual/omora-website.git
   git push -u origin main
   ```

   *(El repositorio ya está iniciado y con un commit inicial.)*

### Paso 3 — En el droplet (por SSH)
```bash
# verifica que los puertos 80 y 443 estén libres (no debe imprimir nada)
sudo ss -tlnp | grep -E ':80 |:443 '

# abre el firewall si usas ufw
sudo ufw allow 80,443/tcp

# clona y levanta
git clone https://github.com/elalfredsensual/omora-website.git /opt/omora
cd /opt/omora
docker compose up -d --build
```

> Si DigitalOcean tiene un *Cloud Firewall* aplicado al droplet, permite también
> HTTP (80) y HTTPS (443) ahí.

### Paso 4 — Verificar
- Abre **https://omora.alfredsensual.com** — debería cargar con candado HTTPS.
- Si algo falla con el certificado: `docker compose logs -f web`
  (Caddy reintenta solo; el DNS debe estar propagado y el puerto 80 accesible).

### Actualizar el sitio publicado
Tras editar contenido (carteras, fotos, textos):

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
├─ Caddyfile           configuración del servidor + HTTPS automático
└─ docker-compose.yml  orquestación del contenedor
```
