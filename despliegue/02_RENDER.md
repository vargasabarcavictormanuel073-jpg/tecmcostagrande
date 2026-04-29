# 🚀 Paso 2 — Desplegar en Render (GRATIS permanente)

Render corre tu servidor Node.js gratis para siempre.
La única limitación: si nadie usa la app por 15 minutos,
se "duerme" y tarda ~30 segundos en despertar la primera vez.
Para uso educativo esto es perfectamente aceptable.

## Requisitos
- Haber completado el Paso 1 (código en GitHub)
- Cuenta en https://render.com
  - Puedes registrarte con tu cuenta de GitHub directamente

---

## Paso 1 — Crear cuenta en Render

1. Ve a https://render.com
2. Clic en **"Get Started for Free"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza Render para acceder a tu GitHub

---

## Paso 2 — Crear nuevo servicio

1. En el dashboard de Render, clic en **"New +"**
2. Selecciona **"Web Service"**
3. Selecciona **"Build and deploy from a Git repository"**
4. Clic en **"Next"**

---

## Paso 3 — Conectar tu repositorio

1. Busca tu repositorio (ej: `tecmcostagrande`)
2. Clic en **"Connect"**

---

## Paso 4 — Configurar el servicio

Llena el formulario con estos valores:

| Campo | Valor |
|---|---|
| **Name** | `educatec` |
| **Region** | Oregon (US West) o el más cercano |
| **Branch** | `main` |
| **Root Directory** | `Backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node servidor.js` |
| **Instance Type** | `Free` ✅ |

---

## Paso 5 — Agregar variables de entorno

Baja hasta la sección **"Environment Variables"** y agrega:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Una frase larga y secreta, ej: `mi_clave_educatec_tecnm_2026_segura` |

> ⚠️ NO agregues PORT — Render lo asigna automáticamente.

---

## Paso 6 — Crear el servicio

1. Clic en **"Create Web Service"**
2. Render empieza a construir (tarda 2-5 minutos la primera vez)
3. Verás los logs en tiempo real

---

## Paso 7 — Obtener tu URL pública

Cuando termine el despliegue verás arriba:
```
https://educatec.onrender.com
```
(o similar con un nombre único)

---

## Paso 8 — Verificar que funciona

Abre en el navegador:
```
https://TU-APP.onrender.com/api/health
```

Debes ver:
```json
{ "exito": true, "mensaje": "EducaTec API funcionando ✅" }
```

Luego abre la app:
```
https://TU-APP.onrender.com
```

---

## Credenciales iniciales

| Usuario | Contraseña | Rol |
|---|---|---|
| LicNyla | Usermaestro1 | Administrador |
| LicNorma | Usermaestro2 | Administrador |
| vargas | Usermaestro3 | Administrador |

---

## Actualizaciones futuras

Cada `git push` a GitHub actualiza Render automáticamente.

---

## ⚠️ Sobre el "sleep" en el plan gratuito

Si nadie usa la app por 15 minutos, Render la "duerme".
La próxima visita tarda ~30 segundos en cargar.
Después de eso funciona normal.

Para evitarlo puedes usar un servicio como UptimeRobot
(https://uptimerobot.com) que hace ping a tu app cada 5 minutos
y la mantiene despierta — completamente gratis.

---

## ⚠️ Sobre la base de datos

Render también tiene almacenamiento efímero en el plan gratuito.
Si el servidor se reinicia, la base de datos se resetea.

**Para uso educativo/demo** esto funciona bien.
**Para producción seria** agrega un disco persistente en Render
(plan de pago ~$1/mes) o migra a Turso (SQLite en la nube, gratis).
