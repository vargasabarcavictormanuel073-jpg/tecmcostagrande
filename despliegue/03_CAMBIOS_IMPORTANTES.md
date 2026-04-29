# ⚙️ Cambios importantes para producción

Este archivo explica qué se modificó en el código para que
funcione tanto en local como en Railway sin cambios adicionales.

---

## 1. URL de la API (frontend)

**Archivo:** `frontend/js/app.js`

```js
// ANTES (solo funcionaba en local):
const API = "http://localhost:5000/api";

// AHORA (funciona en local Y en Railway):
const API = "/api";
```

Al usar `/api` (ruta relativa), el frontend siempre apunta
al mismo servidor que lo sirve, sin importar el dominio.

Lo mismo se aplicó en:
- `frontend/visor_sopa.html`
- `frontend/visor_crucigrama.html`
- `frontend/visor_ahorcado.html`

---

## 2. Puerto del servidor (backend)

**Archivo:** `Backend/configuracion/config.js`

```js
// ANTES (puerto fijo):
PORT: 5000,

// AHORA (Railway asigna el puerto via variable de entorno):
PORT: process.env.PORT || 5000,
```

Railway asigna un puerto diferente a cada app. Si no lees
`process.env.PORT`, el servidor no arranca en Railway.

---

## 3. Clave JWT (backend)

**Archivo:** `Backend/configuracion/config.js`

```js
// ANTES (clave fija en el código):
JWT_SECRET: "edupuzzle_jwt_secret_tecnm_2026",

// AHORA (lee de variable de entorno, con fallback para local):
JWT_SECRET: process.env.JWT_SECRET || "edupuzzle_jwt_secret_tecnm_2026",
```

En Railway debes agregar la variable `JWT_SECRET` en el panel
de Variables con un valor secreto propio.

---

## 4. Archivos de despliegue creados

| Archivo | Para qué sirve |
|---|---|
| `.gitignore` | Le dice a Git qué archivos NO subir |
| `Procfile` | Le dice a Railway cómo iniciar el servidor |
| `despliegue/01_GITHUB.md` | Guía para subir a GitHub |
| `despliegue/02_RAILWAY.md` | Guía para desplegar en Railway |
| `despliegue/03_CAMBIOS_IMPORTANTES.md` | Este archivo |

---

## 5. Para agregar un nuevo maestro en producción

Edita `Backend/base_de_datos/init.js`, sección `maestrosIniciales`:

```js
const maestrosIniciales = [
  { username: "LicNyla",  password: "Usermaestro1", nombre: "Lic. Nyla"  },
  { username: "LicNorma", password: "Usermaestro2", nombre: "Lic. Norma" },
  { username: "vargas",   password: "Usermaestro3", nombre: "Vargas"     },
  // Agrega aquí:
  { username: "NuevoAdmin", password: "SuContraseña", nombre: "Nombre Completo" },
];
```

Luego haz `git push` y Railway redespliega automáticamente.
El nuevo maestro se crea solo al iniciar el servidor.

---

## 6. Para cambiar el límite de usuarios por maestro

Edita `Backend/configuracion/config.js`:

```js
LIMITE_USUARIOS_POR_MAESTRO: 15,  // Cambia este número
```

Haz `git push` y listo.
