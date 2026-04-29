# 📁 Paso 1 — Subir el proyecto a GitHub

## Requisitos
- Tener una cuenta en https://github.com
- Tener Git instalado en tu computadora
  - Verificar: `git --version`
  - Descargar: https://git-scm.com/downloads

---

## Pasos

### 1. Crear el repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repositorio: `educatec` (o el que quieras)
3. Visibilidad: **Public** (necesario para Railway gratis)
4. NO marques "Add a README file"
5. Clic en **Create repository**
6. Copia la URL del repositorio, se ve así:
   `https://github.com/TU_USUARIO/educatec.git`

---

### 2. Inicializar Git en tu proyecto

Abre una terminal en la carpeta raíz del proyecto
(donde está la carpeta `Generaodor_sopas`) y ejecuta:

```bash
git init
git add .
git commit -m "Primer commit - EducaTec"
```

---

### 3. Conectar con GitHub y subir

```bash
git remote add origin https://github.com/TU_USUARIO/educatec.git
git branch -M main
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

### 4. Verificar
Ve a tu repositorio en GitHub y confirma que todos los archivos
están ahí. Deberías ver las carpetas `Backend/` y `frontend/`.

---

## Para subir cambios futuros

Cada vez que hagas cambios y quieras actualizarlos en GitHub:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

---

## ⚠️ Archivos que NO se suben (están en .gitignore)
- `node_modules/` — se instalan automáticamente
- `edupuzzle.db` — la base de datos se crea sola al iniciar
- `.env` — variables de entorno con secretos
