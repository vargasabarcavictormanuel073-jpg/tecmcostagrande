# 🚀 GUÍA COMPLETA DE DESPLIEGUE — EducaTec
### Para quien quiera replicar el proyecto desde cero

Esta guía explica paso a paso cómo subir EducaTec a internet
de forma **completamente gratuita** usando GitHub, Render y UptimeRobot.

---

## 📋 RESUMEN DE LO QUE VAS A CONFIGURAR

| Servicio | Para qué sirve | Costo |
|---|---|---|
| **GitHub** | Guarda el código fuente | Gratis |
| **Render** | Corre el servidor en internet | Gratis |
| **UptimeRobot** | Mantiene la app activa 24/7 | Gratis |

### Cómo funcionan juntos:
```
Tú cambias código en tu computadora
        ↓
git push → sube a GitHub
        ↓
Render detecta el cambio → actualiza la app automáticamente
        ↓
UptimeRobot hace ping cada 5 min → app nunca se duerme
        ↓
Usuarios entran a la app y crean actividades
        ↓
Copian el iframe → lo pegan en su MOOC
        ↓
Alumnos juegan sin necesitar login
```

---

## ✅ REQUISITOS PREVIOS

- Computadora con Windows, Mac o Linux
- Git instalado: https://git-scm.com/downloads
  - Verificar: abre CMD y escribe `git --version`
- Node.js instalado (para probar en local): https://nodejs.org
- Correo electrónico para crear las cuentas

---

# PARTE 1 — GITHUB

## ¿Qué es GitHub?
GitHub guarda tu código en la nube. Es como un USB gigante
en internet. Render lee el código desde aquí para correr la app.

## Paso 1 — Crear cuenta en GitHub
1. Ve a https://github.com/signup
2. Ingresa tu correo, contraseña y nombre de usuario
3. Verifica tu correo
4. Selecciona el plan **Free**

## Paso 2 — Crear el repositorio
1. Ve a https://github.com/new
2. Llena el formulario:
   - **Repository name:** `educatec` (o el nombre que quieras)
   - **Description:** `Plataforma educativa EducaTec - TecNM`
   - **Visibility:** ✅ **Public**
   - ❌ NO marques ninguna opción adicional
3. Clic en **"Create repository"**
4. Guarda la URL que aparece:
   `https://github.com/TU_USUARIO/educatec.git`

## Paso 3 — Subir el código

Abre CMD o PowerShell y ejecuta uno por uno:

```bash
cd C:\ruta\donde\esta\Generaodor_sopas
```

```bash
git init
```

```bash
git config user.email "TU_CORREO@gmail.com"
git config user.name "TU_USUARIO_GITHUB"
```

```bash
git add .
```

> Si aparece error `does not have a commit checked out`:
> ```bash
> Remove-Item -Recurse -Force Backend\.git
> git add .
> ```

```bash
git commit -m "Primer commit - EducaTec"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/TU_USUARIO/educatec.git
```

```bash
git push -u origin main
```

## Paso 4 — Verificar
Ve a `https://github.com/TU_USUARIO/educatec` y confirma
que ves todos los archivos del proyecto.

## Para subir cambios futuros
```bash
cd C:\ruta\Generaodor_sopas
git add .
git commit -m "Descripción del cambio"
git push
```

---

# PARTE 2 — RENDER

## ¿Qué es Render?
Render es el servidor donde vive tu app. Corre el código Node.js,
sirve el frontend y maneja la base de datos. Es gratis para siempre
con el plan Free.

## Paso 1 — Crear cuenta en Render
1. Ve a https://render.com
2. Clic en **"Get Started for Free"**
3. Clic en **"Continue with GitHub"**
4. Autoriza Render para acceder a tu GitHub
5. Completa el registro si te pide más datos

## Paso 2 — Crear el servicio web
1. En el dashboard, clic en **"New +"**
2. Selecciona **"Web Service"**
3. Selecciona **"Build and deploy from a Git repository"**
4. Clic en **"Next"**

## Paso 3 — Conectar tu repositorio
1. Busca tu repositorio `educatec`
2. Clic en **"Connect"**

> Si no aparece tu repo, clic en "Configure account" y
> autoriza Render para acceder a tus repositorios de GitHub.

## Paso 4 — Configurar el servicio

Llena los campos exactamente así:

| Campo | Valor |
|---|---|
| **Name** | `educatec` |
| **Language** | `Node` |
| **Branch** | `main` |
| **Region** | `Oregon (US West)` |
| **Root Directory** | `Backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node servidor.js` |

## Paso 5 — Seleccionar plan gratuito
- Baja hasta **"Instance Type"**
- Selecciona **"Free"** ($0/month)

## Paso 6 — Agregar variables de entorno
Baja hasta **"Environment Variables"** y agrega:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Una frase larga y secreta, ej: `mi_clave_educatec_2026_segura` |

> ⚠️ NO agregues PORT — Render lo asigna automáticamente.

## Paso 7 — Desplegar
1. Clic en **"Create Web Service"**
2. Render empieza a construir (tarda 3-5 minutos)
3. Verás los logs en tiempo real
4. Cuando diga **"Your service is live"** está listo

## Paso 8 — Obtener tu URL
Tu app estará disponible en:
```
https://educatec.onrender.com
```
(o similar con un nombre único)

## Paso 9 — Verificar
Abre en el navegador:
```
https://TU-APP.onrender.com/api/health
```
Debes ver:
```json
{ "exito": true, "mensaje": "EducaTec API funcionando ✅" }
```

## Actualizaciones futuras
Cada `git push` a GitHub actualiza Render automáticamente
en 2-3 minutos. No necesitas hacer nada en Render.

---

# PARTE 3 — UPTIMEROBOT

## ¿Qué es UptimeRobot y por qué lo necesitas?

Render en el plan gratuito tiene una limitación: si nadie
visita la app por **15 minutos**, la "duerme" para ahorrar recursos.
La próxima visita tarda ~30 segundos en cargar.

**UptimeRobot soluciona esto** mandando un "ping" (visita automática)
a tu app cada 5 minutos. Así Render nunca la duerme.

Además, si tu app se cae por cualquier razón, UptimeRobot
te manda un email avisándote inmediatamente.

## Paso 1 — Crear cuenta en UptimeRobot
1. Ve a https://uptimerobot.com
2. Clic en **"Register for FREE"**
3. Ingresa tu correo y contraseña
4. Verifica tu correo

## Paso 2 — Crear el monitor
1. En el dashboard, clic en **"+ New Monitor"** o **"Add New Monitor"**
2. Selecciona **"HTTP(s)"** como tipo de monitor
3. Llena el formulario:

| Campo | Valor |
|---|---|
| **Friendly Name** | `EducaTec` |
| **URL** | `https://TU-APP.onrender.com/api/health` |
| **Monitoring Interval** | `5 minutes` |

4. Clic en **"Create Monitor"**

## Paso 3 — Verificar que funciona
En el dashboard verás tu monitor con un punto **verde** y
el texto **"Up"**. Eso significa que tu app está activa.

## ¿Qué hace exactamente el monitor?
- Cada 5 minutos visita `https://TU-APP.onrender.com/api/health`
- Si responde correctamente → punto verde, todo bien
- Si no responde → punto rojo + email de alerta a tu correo
- Mantiene la app despierta en Render indefinidamente

---

# RESUMEN FINAL

Una vez configurado todo, el sistema funciona solo:

```
┌─────────────────────────────────────────────┐
│                  GITHUB                      │
│  Guarda el código fuente                     │
│  URL: github.com/TU_USUARIO/educatec         │
└──────────────────┬──────────────────────────┘
                   │ git push (automático)
                   ▼
┌─────────────────────────────────────────────┐
│                  RENDER                      │
│  Corre el servidor Node.js + SQLite          │
│  URL: https://TU-APP.onrender.com            │
└──────────────────┬──────────────────────────┘
                   │ ping cada 5 min
                   ▼
┌─────────────────────────────────────────────┐
│               UPTIMEROBOT                    │
│  Vigila que la app esté activa 24/7          │
│  Manda email si se cae                       │
└─────────────────────────────────────────────┘
```

## Credenciales iniciales de la app

| Usuario | Contraseña | Rol |
|---|---|---|
| LicNyla | Usermaestro1 | Administrador |
| LicNorma | Usermaestro2 | Administrador |
| vargas | Usermaestro3 | Administrador |

> ⚠️ Cambia estas contraseñas después del primer acceso.

## Para agregar más administradores
Edita `Backend/base_de_datos/init.js` → sección `maestrosIniciales`
Agrega: `{ username: "Nuevo", password: "Contraseña", nombre: "Nombre" }`
Luego haz `git push` y Render actualiza automáticamente.

## Para cambiar el límite de usuarios por administrador
Edita `Backend/configuracion/config.js`
Cambia: `LIMITE_USUARIOS_POR_MAESTRO: 15`
Luego haz `git push`.
