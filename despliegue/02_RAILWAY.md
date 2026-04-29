# 🚂 Paso 2 — Desplegar en Railway

Railway es una plataforma que corre tu servidor Node.js en la nube
de forma gratuita. El proyecto queda en una URL pública permanente.

## Requisitos
- Haber completado el Paso 1 (proyecto en GitHub)
- Cuenta en https://railway.app (puedes entrar con tu cuenta de GitHub)

---

## Pasos

### 1. Crear proyecto en Railway
1. Ve a https://railway.app
2. Clic en **Start a New Project**
3. Selecciona **Deploy from GitHub repo**
4. Autoriza Railway para acceder a tu GitHub si te lo pide
5. Selecciona el repositorio `educatec`
6. Railway detecta automáticamente que es Node.js y empieza a construir

---

### 2. Configurar variables de entorno
Una vez creado el proyecto en Railway:

1. Clic en tu proyecto → pestaña **Variables**
2. Agrega estas variables:

| Variable | Valor |
|---|---|
| `JWT_SECRET` | Una cadena larga y aleatoria, ej: `mi_clave_super_secreta_2026_tecnm` |
| `NODE_ENV` | `production` |

> ⚠️ El PORT lo asigna Railway automáticamente, NO lo agregues.

---

### 3. Configurar el comando de inicio
Railway debería detectarlo automáticamente desde el `Procfile`.
Si no lo hace:

1. Ve a tu proyecto → **Settings** → **Deploy**
2. En **Start Command** escribe:
   ```
   cd Backend && node servidor.js
   ```
3. En **Build Command** escribe:
   ```
   cd Backend && npm install
   ```

---

### 4. Obtener tu URL pública
1. Ve a tu proyecto → pestaña **Settings** → **Domains**
2. Clic en **Generate Domain**
3. Railway te da una URL como:
   `https://educatec-production.up.railway.app`

¡Esa es tu URL pública! Compártela con tus usuarios.

---

### 5. Verificar que funciona
Abre en el navegador:
```
https://TU-URL.up.railway.app/api/health
```
Debes ver:
```json
{ "exito": true, "mensaje": "EducaTec API funcionando ✅" }
```

Luego abre la app:
```
https://TU-URL.up.railway.app
```

---

## Actualizaciones futuras

Cada vez que hagas `git push` a GitHub, Railway detecta el cambio
y redespliega automáticamente en 1-2 minutos. No necesitas hacer
nada más.

---

## ⚠️ Sobre la base de datos en Railway

Railway tiene un sistema de archivos **efímero** — si el servidor
se reinicia, el archivo `.db` puede perderse.

**Para producción seria se recomienda:**
- Usar el volumen persistente de Railway (plan de pago)
- O migrar la BD a PlanetScale / Turso (gratuito)

**Para uso educativo/demo** el plan gratuito funciona bien
mientras el servidor no se reinicie frecuentemente.

---

## Credenciales iniciales (se crean automáticamente)

| Usuario | Contraseña | Rol |
|---|---|---|
| LicNyla | Usermaestro1 | Administrador |
| LicNorma | Usermaestro2 | Administrador |
| vargas | Usermaestro3 | Administrador |
