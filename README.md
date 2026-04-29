# EducaTec — Generador de Actividades Educativas

Plataforma del Tecnológico Nacional de México para generar Sopas de Letras, Crucigramas y más actividades interactivas para cursos MOOC.

---

## ▶️ Cómo correrlo

### Requisitos previos
- Tener instalado **Node.js** (versión 16 o superior)
- Verificar con: `node -v` y `npm -v`

---

### Paso 1 — Instalar dependencias

Abre una terminal y ejecuta:

```bash
cd Generaodor_sopas/Backend
npm install
```

Esto instala Express, SQLite, JWT, bcrypt y todo lo necesario. Solo se hace **una vez**.

---

### Paso 2 — Iniciar el servidor

```bash
cd Generaodor_sopas/Backend
node servidor.js
```

O en modo desarrollo (se reinicia automáticamente al guardar cambios):

```bash
npm run dev
```

Verás esto en la terminal cuando esté listo:

```
🚀 EducaTec corriendo en http://localhost:5000
🌐 Frontend:  http://localhost:5000/index.html
🔍 Health:    http://localhost:5000/api/health

👨‍🏫 Maestros: LicNyla/Usermaestro1 | LicNorma/Usermaestro2 | vargas/Usermaestro3
```

La base de datos SQLite se crea **automáticamente** en `Backend/base_de_datos/edupuzzle.db`

---

### Paso 3 — Abrir en el navegador

```
http://localhost:5000
```

> ⚠️ **Importante:** Siempre abre la app desde `http://localhost:5000` y NO abriendo los archivos HTML directamente desde el explorador de archivos. Si los abres como `file://` el login no funcionará.

---

## 👤 Usuarios iniciales (Maestros)

| Usuario   | Contraseña    |
|-----------|---------------|
| LicNyla   | Usermaestro1  |
| LicNorma  | Usermaestro2  |
| vargas    | Usermaestro3  |

---

## 🔄 Flujo de uso

```
Maestro inicia sesión
  └── Crea usuarios (máx. 10)

Usuario inicia sesión
  └── Crea Sopa de Letras  → se autoguarda → copia iframe → pega en MOOC
  └── Crea Crucigrama      → se autoguarda → copia iframe → pega en MOOC

Alumnos del MOOC
  └── Abren el iframe → juegan sin necesidad de login
  └── Cronómetro automático + confeti al completar
```

---

## 🔗 Sobre los links/iframes generados

- El link **nunca expira** por sí solo
- Funciona para cualquier alumno sin login
- Solo deja de funcionar si el usuario elimina la actividad desde su historial
- Formato del link: `http://localhost:5000/visor_sopa.html?id=5`

---

## 📁 Estructura del proyecto

```
Generaodor_sopas/
├── Backend/
│   ├── servidor.js              ← Punto de entrada + sirve el frontend
│   ├── package.json
│   ├── configuracion/
│   │   └── config.js            ← Límites, JWT, puerto
│   ├── base_de_datos/
│   │   ├── init.js              ← Crea tablas + maestros iniciales
│   │   ├── db.js                ← Conexión SQLite
│   │   └── edupuzzle.db         ← Se genera automáticamente
│   ├── modelos/
│   │   ├── Maestro.js
│   │   ├── Usuario.js
│   │   ├── Sopa.js
│   │   └── Crucigrama.js
│   ├── controladores/
│   │   ├── authController.js
│   │   ├── maestrosController.js
│   │   ├── usuariosController.js
│   │   ├── sopasController.js
│   │   └── crucigramasController.js
│   ├── rutas/
│   │   ├── auth.js
│   │   ├── maestros.js
│   │   ├── usuarios.js
│   │   ├── sopas.js
│   │   └── crucigramas.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── validar.js
│   └── utilidades/
│       └── respuesta.js
└── frontend/
    ├── index.html               ← Login
    ├── dashboard.html           ← Panel maestro
    ├── usuarios.html            ← Gestión de usuarios
    ├── actividades.html         ← Ver actividades de usuarios
    ├── sopas.html               ← Generador sopas de letras
    ├── crucigramas.html         ← Generador crucigramas
    ├── visor_sopa.html          ← Visor público (iframe) con cronómetro
    ├── visor_crucigrama.html    ← Visor público (iframe) con cronómetro
    ├── Pagina_Principal/
    │   └── index.html           ← Landing page
    ├── css/
    │   └── style.css
    └── js/
        ├── app.js
        ├── login.js
        └── dashboard.js
```

---

## 🌐 API Endpoints

| Método | Ruta                       | Descripción           | Rol     |
|--------|----------------------------|-----------------------|---------|
| POST   | /api/auth/login-maestro    | Login maestro         | Público |
| POST   | /api/auth/login-usuario    | Login usuario         | Público |
| GET    | /api/auth/perfil           | Perfil + contadores   | Ambos   |
| GET    | /api/maestros/estadisticas | Stats del maestro     | Maestro |
| GET    | /api/maestros/actividades  | Actividades usuarios  | Maestro |
| GET    | /api/usuarios              | Listar usuarios       | Maestro |
| POST   | /api/usuarios              | Crear usuario         | Maestro |
| PUT    | /api/usuarios/:id          | Editar usuario        | Maestro |
| DELETE | /api/usuarios/:id          | Eliminar usuario      | Maestro |
| GET    | /api/sopas                 | Historial sopas       | Usuario |
| POST   | /api/sopas                 | Guardar sopa          | Usuario |
| GET    | /api/sopas/:id             | Obtener sopa          | Usuario |
| DELETE | /api/sopas/:id             | Eliminar sopa         | Usuario |
| GET    | /api/crucigramas           | Historial crucigramas | Usuario |
| POST   | /api/crucigramas           | Guardar crucigrama    | Usuario |
| GET    | /api/crucigramas/:id       | Obtener crucigrama    | Usuario |
| DELETE | /api/crucigramas/:id       | Eliminar crucigrama   | Usuario |

---

## ⚙️ Reglas del sistema

- Cada maestro puede crear **máximo 10 usuarios**
- Cada usuario puede guardar **máximo 30 sopas**
- Cada usuario puede guardar **máximo 20 crucigramas**
- Las contraseñas se almacenan con **bcrypt**
- Autenticación con **JWT** (expira en 8 horas)
- Las sopas y crucigramas se **autoguardan** al generarse
- Los visores públicos **no requieren login**
