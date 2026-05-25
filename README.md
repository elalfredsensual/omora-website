# Omora — sitio web

Sitio web de Omora hecho con [Astro](https://astro.build) (SSR / Node) y
servido como un solo contenedor Docker. Trae un **panel de administración** en
`/admin` para que la suegrita (o tú) agreguen, editen, oculten, marquen como
agotadas o eliminen carteras — sin tocar código ni hacer redeploy.

**En producción:** https://omora.alfredsensual.com
**Panel admin:** https://omora.alfredsensual.com/admin

> El sitio está detrás del nginx del host. El contenedor escucha en
> `127.0.0.1:8092`. El catálogo (`purses.json`) y las fotos subidas viven en un
> **volumen Docker** (`omora_data`), así que los cambios del admin sobreviven
> a cada `docker compose up --build`.

---

## 1. Desarrollo local

Requiere [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:4321 (con admin en /admin)
npm run build    # compila el server SSR a  dist/
npm run preview  # corre el server compilado
```

Para usar el admin en local, exporta antes las variables:

```bash
# PowerShell
$env:ADMIN_PASSWORD="test123"; $env:SESSION_SECRET="devsecret"; npm run dev
```

Sin `ADMIN_PASSWORD` el panel rechazará todos los logins.

---

## 2. Panel de administración (`/admin`)

Para la suegrita, los pasos son:

1. Entrar a **https://omora.alfredsensual.com/admin**
2. Escribir la contraseña → quedas dentro por 30 días
3. Desde el dashboard:
   - **Nueva cartera** → formulario con nombre, descripción, precio, categoría, estado y fotos
   - **Editar** (en cada cartera) → cambia textos, sube fotos nuevas, elimina las que no quieras
   - **Cambiar estado** (menú desplegable):
     - **Visible** — se muestra normal en la galería
     - **Sin stock** — sigue apareciendo pero con badge "Agotada" y el botón de WhatsApp cambia a "Pregúntanos cuándo vuelve"
     - **Oculta** — desaparece de la galería pública
   - **Eliminar** — borra la cartera y sus fotos (pide confirmación)

Los cambios son **instantáneos** — no hay que esperar a un rebuild.

---

## 3. Probar el contenedor en local (opcional)

Requiere Docker Desktop corriendo.

```bash
cp .env.example .env       # edita los valores
docker compose up --build
# abre http://localhost:8092  (y /admin)
```

---

## 4. Despliegue en omora.alfredsensual.com

El sitio se publica en el **mismo droplet** que aloja
`managementdoral.alfredsensual.com`. nginx del host enruta el dominio al
contenedor en `127.0.0.1:8092`.

### Paso 1 — DNS en GoDaddy (solo la primera vez)
GoDaddy → `alfredsensual.com` → DNS → registro nuevo:

| Tipo | Nombre  | Valor                          | TTL     |
|------|---------|--------------------------------|---------|
| A    | `omora` | *IP del droplet*               | 600 seg |

### Paso 2 — Subir el sitio a GitHub
```bash
cd "D:\Trabajo\Carteras Suegrita"
git push
```

### Paso 3 — En el droplet
```bash
# primera vez: clonar
git clone https://github.com/elalfredsensual/omora-website.git /opt/omora
cd /opt/omora

# configurar las claves (solo la primera vez)
cp .env.example .env
nano .env                            # pon ADMIN_PASSWORD y SESSION_SECRET fuertes
#  para SESSION_SECRET puedes usar:  openssl rand -hex 32

# levantar
docker compose up -d --build
curl -I http://127.0.0.1:8092        # debe responder "HTTP/1.1 200 OK"
```

### Paso 4 — nginx + HTTPS (solo la primera vez)
DNS debe estar propagado: `dig +short omora.alfredsensual.com`.

```bash
cd /opt/omora
sudo cp deploy/omora.alfredsensual.com.conf /etc/nginx/sites-available/omora.alfredsensual.com
sudo ln -s /etc/nginx/sites-available/omora.alfredsensual.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d omora.alfredsensual.com
```

### Paso 5 — Verificar
- Visita **https://omora.alfredsensual.com** → carga con HTTPS
- Visita **https://omora.alfredsensual.com/admin** → pide la contraseña

### Actualizar el sitio publicado
Tras cambios en el código (no necesario para cambios de catálogo, que se hacen
desde el admin):
```bash
# en tu PC
git push

# en el droplet
cd /opt/omora && git pull && docker compose up -d --build
```
El volumen `omora_data` no se borra — el catálogo y las fotos persisten.

---

## Estructura del proyecto

```
├─ public/images/      logos, favicon, fotos del catálogo semilla
├─ src/
│  ├─ data/purses.ts   tipos + catálogo semilla (primer arranque)
│  ├─ lib/
│  │  ├─ db.ts         lectura/escritura del JSON + fotos en /data
│  │  └─ auth.ts       sesiones firmadas con HMAC
│  ├─ middleware.ts    protege /admin
│  ├─ components/      secciones del sitio público
│  ├─ layouts/         AdminLayout + Layout
│  ├─ pages/
│  │  ├─ index.astro   sitio público
│  │  ├─ admin/        panel (login, dashboard, nueva, editar, etc.)
│  │  └─ uploads/[file].ts  sirve fotos desde el volumen
│  └─ styles/          tokens globales + estilos admin
├─ deploy/             config de nginx (se copia al droplet)
├─ Dockerfile          build (Node) → runtime (Node)
└─ docker-compose.yml  un contenedor + volumen omora_data
```
