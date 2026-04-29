# 🚂 Paso 2 — Desplegar en Railway

Railway corre tu servidor Node.js en la nube de forma gratuita
y te da una URL pública permanente.

## Requisitos
- Haber completado el Paso 1 (código en GitHub)
- Cuenta en https://railway.app
  - Puedes registrarte con tu cuenta de GitHub directamente

---

## Paso 1 — Entrar a Railway

1. Ve a https://railway.app
2. Clic en **"Login"** → **"Login with GitHub"**
3. Autoriza Railway para acceder a tu GitHub

---

## Paso 2 — Crear nuevo proyecto

1. Clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Si es la primera vez, clic en **"Configure GitHub App"** y autoriza
4. Selecciona tu repositorio (ej: `tecmcostagrande`)
5. Railway empieza a construir automáticamente

---

## Paso 3 — Configurar variables de entorno

Una vez creado el proyecto:

1. Clic en tu servicio dentro del proyecto
2. Ve a la pestaña **"Variables"**
3. Agrega estas variables una por una con **"New Variable"**:

| Variable | Valor |
|---|---|
| `JWT_SECRET` | Una frase larga y secreta, ej: `mi_clave_educatec_tecnm_2026_segura` |
| `NODE_ENV` | `production` |

> ⚠️ NO agregues PORT — Railway lo asigna automáticamente.

---

## Paso 4 — Configurar el comando de inicio

Si Railway no detecta automáticamente cómo iniciar el servidor:

1. Ve a la pestaña **"Settings"** de tu servicio
2. Busca **"Deploy"** → **"Start Command"**
3. Escribe:
   ```
   cd Backend && node servidor.js
   ```
4. Busca **"Build"** → **"Build Command"**
5. Escribe:
   ```
   cd Backend && npm install
   ```
6. Clic en **"Save"**

> Si el proyecto tiene el archivo `Procfile` en la raíz,
> Railway lo detecta automáticamente y no necesitas hacer esto.

---

## Paso 5 — Obtener tu URL pública

1. Ve a la pestaña **"Settings"** de tu servicio
2. Busca la sección **"Domains"**
3. Clic en **"Generate Domain"**
4. Railway te da una URL como:
   `https://tecmcostagrande-production.up.railway.app`

---

## Paso 6 — Verificar que funciona

Abre en el navegador:
```
https://TU-URL.up.railway.app/api/health
```

Debes ver:
```json
{ "exito": true, "mensaje": "EducaTec API funcionando ✅" }
```

Luego abre la app completa:
```
https://TU-URL.up.railway.app
```

---

## Credenciales iniciales (se crean automáticamente)

| Usuario | Contraseña | Rol |
|---|---|---|
| LicNyla | Usermaestro1 | Administrador |
| LicNorma | Usermaestro2 | Administrador |
| vargas | Usermaestro3 | Administrador |

> ⚠️ Cambia estas contraseñas después del primer acceso.
> Puedes agregar más administradores en:
> `Backend/base_de_datos/init.js` → sección `maestrosIniciales`

---

## Actualizaciones futuras

Cada vez que hagas cambios y los subas a GitHub con `git push`,
Railway los detecta automáticamente y redespliega en 1-2 minutos.
No necesitas hacer nada más en Railway.

---

## ⚠️ Sobre la base de datos

Railway tiene almacenamiento **efímero** en el plan gratuito.
Si el servidor se reinicia, la base de datos puede resetearse.

**Para uso educativo/demo** esto funciona bien.
**Para uso en producción seria** se recomienda:
- Activar un volumen persistente en Railway (plan de pago ~$5/mes)
- O migrar la BD a Turso (SQLite en la nube, gratis)
