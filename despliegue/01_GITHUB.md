# 📁 Paso 1 — Subir el proyecto a GitHub

## Requisitos previos
- Tener una cuenta en https://github.com
- Tener Git instalado: https://git-scm.com/downloads
  - Verificar que está instalado: abre CMD y escribe `git --version`

---

## Paso 1 — Crear el repositorio en GitHub

1. Ve a https://github.com/new
2. Llena el formulario:
   - **Repository name:** el nombre que quieras, ej: `educatec`
   - **Description:** `Plataforma educativa EducaTec - TecNM` (opcional)
   - **Visibility:** ✅ **Public** (necesario para Railway gratis)
   - ❌ NO marques "Add a README file"
   - ❌ NO marques "Add .gitignore"
   - ❌ NO marques "Choose a license"
3. Clic en **"Create repository"**
4. Guarda la URL que aparece, se ve así:
   `https://github.com/TU_USUARIO/TU_REPO.git`

---

## Paso 2 — Abrir la terminal

- Windows: presiona `Windows + R`, escribe `cmd` o `powershell`, Enter
- O abre la terminal desde VS Code: menú Terminal → New Terminal

---

## Paso 3 — Ir a la carpeta del proyecto

```bash
cd C:\ruta\donde\esta\tu\proyecto\Generaodor_sopas
```

Ejemplo real:
```bash
cd C:\Users\varga\Downloads\AppEducatec\Generaodor_sopas
```

---

## Paso 4 — Inicializar Git

```bash
git init
```

Verás: `Initialized empty Git repository in ...`

---

## Paso 5 — Configurar tu usuario de GitHub (solo para este proyecto)

```bash
git config user.email "TU_CORREO@gmail.com"
git config user.name "TU_USUARIO_GITHUB"
```

Ejemplo:
```bash
git config user.email "costagrandetecnm@gmail.com"
git config user.name "vargasabarcavictormanuel073-jpg"
```

> ⚠️ Esto configura Git solo para este proyecto, no afecta otros repositorios.

---

## Paso 6 — Agregar todos los archivos

```bash
git add .
```

Si aparece error `does not have a commit checked out` en la carpeta Backend:
```bash
Remove-Item -Recurse -Force Backend\.git
git add .
```

---

## Paso 7 — Hacer el primer commit

```bash
git commit -m "Primer commit - EducaTec"
```

Verás una lista de todos los archivos que se agregaron.

---

## Paso 8 — Cambiar la rama a main

```bash
git branch -M main
```

---

## Paso 9 — Conectar con tu repositorio de GitHub

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
```

Ejemplo:
```bash
git remote add origin https://github.com/vargasabarcavictormanuel073-jpg/tecmcostagrande.git
```

---

## Paso 10 — Subir el código a GitHub

```bash
git push -u origin main
```

Si pide usuario y contraseña, usa los de tu cuenta de GitHub.

> ⚠️ Si tienes autenticación de dos factores activada, necesitas
> un Personal Access Token en lugar de contraseña.
> Créalo en: GitHub → Settings → Developer settings → Personal access tokens

---

## ✅ Verificar que funcionó

Ve a `https://github.com/TU_USUARIO/TU_REPO` y deberías ver
todos los archivos del proyecto.

---

## Para subir cambios futuros

Cada vez que modifiques algo y quieras actualizarlo en GitHub:

```bash
cd C:\ruta\del\proyecto\Generaodor_sopas
git add .
git commit -m "Descripción del cambio"
git push
```

---

## ⚠️ Archivos que NO se suben (están en .gitignore)
- `node_modules/` — se instalan automáticamente con `npm install`
- `edupuzzle.db` — la base de datos se crea sola al iniciar el servidor
- `.env` — variables de entorno con secretos
