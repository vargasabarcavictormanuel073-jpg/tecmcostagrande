/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: servidor.js
 * DESCRIPCIÓN: Punto de entrada principal del servidor EducaTec.
 *              Configura Express, registra todas las rutas de la
 *              API y sirve el frontend estático.
 *
 * PARA CORRERLO:
 *   node servidor.js          ← producción
 *   npm run dev               ← desarrollo (se reinicia automático)
 *
 * PARA AGREGAR UNA NUEVA RUTA DE API:
 *   1. Crea el modelo en:      modelos/NuevoModelo.js
 *   2. Crea el controlador en: controladores/nuevoController.js
 *   3. Crea las rutas en:      rutas/nuevo.js
 *   4. Registra aquí:          app.use("/api/nuevo", require("./rutas/nuevo"))
 * ═══════════════════════════════════════════════════════════════
 */

const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");
const path    = require("path");
const config  = require("./configuracion/config");
const initDB  = require("./base_de_datos/init");

const app = express();

// ── MIDDLEWARES GLOBALES ─────────────────────────────────────────
// Permite peticiones desde cualquier origen (necesario para el frontend)
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
// Parsea el body de las peticiones como JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Muestra en consola cada petición HTTP recibida
app.use(morgan("dev"));

// ── FRONTEND ESTÁTICO ────────────────────────────────────────────
// Sirve todos los archivos de la carpeta frontend/
// Esto permite abrir http://localhost:5000 directamente
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// ── RUTAS DE LA API ──────────────────────────────────────────────
// Autenticación (login maestro y usuario, perfil)
app.use("/api/auth",        require("./rutas/auth"));

// Gestión de maestros (estadísticas, actividades de sus usuarios)
app.use("/api/maestros",    require("./rutas/maestros"));

// Gestión de usuarios/alumnos (CRUD, solo maestros)
app.use("/api/usuarios",    require("./rutas/usuarios"));

// Sopas de letras (CRUD, solo usuarios)
app.use("/api/sopas",       require("./rutas/sopas"));

// Crucigramas (CRUD, solo usuarios)
app.use("/api/crucigramas", require("./rutas/crucigramas"));

// Ahorcado (CRUD + endpoint público para iframe, solo usuarios)
app.use("/api/ahorcado",    require("./rutas/ahorcado"));

// ── HEALTH CHECK ─────────────────────────────────────────────────
// Endpoint para verificar que el servidor está corriendo
app.get("/api/health", (req, res) => {
  res.json({ exito: true, mensaje: "EducaTec API funcionando ✅", version: "1.0.0" });
});

// ── FALLBACK FRONTEND ────────────────────────────────────────────
// Cualquier ruta que NO sea /api/* sirve el index.html del frontend
// Esto permite que las rutas del frontend funcionen correctamente
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ── MANEJO DE ERRORES ────────────────────────────────────────────
// 404 para rutas de API no encontradas
app.use((req, res) => {
  res.status(404).json({ exito: false, mensaje: "Ruta no encontrada" });
});

// Error global — captura cualquier error no manejado
app.use((err, req, res, next) => {
  console.error("❌", err.message);
  res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
});

// ── INICIAR SERVIDOR ─────────────────────────────────────────────
initDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`\n🚀 EducaTec corriendo en http://localhost:${config.PORT}`);
    console.log(`🌐 Frontend:  http://localhost:${config.PORT}/index.html`);
    console.log(`🔍 Health:    http://localhost:${config.PORT}/api/health`);
    console.log(`\n👨‍🏫 Maestros: LicNyla/Usermaestro1 | LicNorma/Usermaestro2 | vargas/Usermaestro3\n`);
  });
}).catch(err => {
  console.error("❌ Error al iniciar la base de datos:", err);
  process.exit(1);
});
