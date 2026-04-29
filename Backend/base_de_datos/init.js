/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: init.js
 * DESCRIPCIÓN: Inicialización de la base de datos SQLite.
 *              Se ejecuta automáticamente al arrancar el servidor.
 *              Crea todas las tablas si no existen y registra
 *              los maestros iniciales del sistema.
 * ═══════════════════════════════════════════════════════════════
 *
 * ── CÓMO AGREGAR UN NUEVO MAESTRO ───────────────────────────────
 *   Busca la sección "MAESTROS INICIALES" al final de este archivo.
 *   Agrega un nuevo objeto al array maestrosIniciales:
 *
 *   { username: "NuevoMaestro", password: "SuContraseña", nombre: "Nombre Completo" }
 *
 *   Guarda el archivo y reinicia el servidor. El maestro se creará
 *   automáticamente si no existe en la base de datos.
 *
 * ── CÓMO AGREGAR UNA NUEVA TABLA ────────────────────────────────
 *   Copia el bloque de una tabla existente, cámbialo con los
 *   campos que necesitas y agrégalo antes de la sección SESIONES.
 *
 * ── NOTA IMPORTANTE ─────────────────────────────────────────────
 *   Las tablas solo se crean si NO existen. Si ya existen y
 *   quieres modificarlas, debes eliminar el archivo .db y
 *   reiniciar el servidor (se recrean solas).
 *   El archivo .db está en: base_de_datos/edupuzzle.db
 * ═══════════════════════════════════════════════════════════════
 */

const bcrypt = require("bcryptjs");
const db = require("./db");

async function initDB() {

  // ── TABLA: maestros ─────────────────────────────────────────────
  // Almacena las cuentas de los maestros (administradores).
  // Los maestros crean y gestionan usuarios (alumnos).
  // Campos: id, username, password (hash), nombre, email, activo, creado_en
  const tieneMaestros = await db.schema.hasTable("maestros");
  if (!tieneMaestros) {
    await db.schema.createTable("maestros", (t) => {
      t.increments("id").primary();                          // ID único autoincremental
      t.string("username").notNullable().unique();           // Nombre de usuario (único)
      t.string("password").notNullable();                    // Contraseña encriptada con bcrypt
      t.string("nombre").notNullable();                      // Nombre completo del maestro
      t.string("email");                                     // Email (opcional)
      t.integer("activo").notNullable().defaultTo(1);        // 1=activo, 0=inactivo
      t.timestamp("creado_en").defaultTo(db.fn.now());       // Fecha de creación automática
    });
    console.log("✅ Tabla maestros creada");
  }

  // ── TABLA: usuarios ─────────────────────────────────────────────
  // Almacena las cuentas de los usuarios (alumnos/docentes MOOC).
  // Cada usuario pertenece a un maestro (maestro_id).
  // Si se elimina el maestro, sus usuarios se eliminan en cascada.
  // Campos: id, maestro_id, username, password, nombre, email, activo, creado_en
  const tieneUsuarios = await db.schema.hasTable("usuarios");
  if (!tieneUsuarios) {
    await db.schema.createTable("usuarios", (t) => {
      t.increments("id").primary();
      t.integer("maestro_id")
        .notNullable()
        .references("id").inTable("maestros")
        .onDelete("CASCADE");                                // Al borrar maestro, borra sus usuarios
      t.string("username").notNullable().unique();
      t.string("password").notNullable();
      t.string("nombre").notNullable();
      t.string("email");
      t.integer("activo").notNullable().defaultTo(1);
      t.timestamp("creado_en").defaultTo(db.fn.now());
    });
    console.log("✅ Tabla usuarios creada");
  }

  // ── TABLA: sopas_letras ─────────────────────────────────────────
  // Almacena las sopas de letras creadas por los usuarios.
  // grid_data guarda el JSON completo de la cuadrícula generada.
  // Si se elimina el usuario, sus sopas se eliminan en cascada.
  // Campos: id, usuario_id, titulo, palabras (JSON), tamano, direcciones, grid_data (JSON), creado_en
  const tieneSopas = await db.schema.hasTable("sopas_letras");
  if (!tieneSopas) {
    await db.schema.createTable("sopas_letras", (t) => {
      t.increments("id").primary();
      t.integer("usuario_id")
        .notNullable()
        .references("id").inTable("usuarios")
        .onDelete("CASCADE");
      t.string("titulo").notNullable();
      t.text("palabras").notNullable();                      // JSON: ["PALABRA1", "PALABRA2", ...]
      t.integer("tamano").notNullable().defaultTo(15);       // Tamaño de la cuadrícula: 10, 15 o 20
      t.string("direcciones").notNullable().defaultTo("all");// "basic", "all" o "reverse"
      t.text("grid_data");                                   // JSON: {grid:[[...]], placed:[...]}
      t.timestamp("creado_en").defaultTo(db.fn.now());
    });
    console.log("✅ Tabla sopas_letras creada");
  }

  // ── TABLA: crucigramas ──────────────────────────────────────────
  // Almacena los crucigramas creados por los usuarios.
  // palabras guarda array de {word, clue} (palabra y pista).
  // grid_data guarda la cuadrícula con posiciones de cada palabra.
  // Campos: id, usuario_id, titulo, palabras (JSON), grid_data (JSON), creado_en
  const tieneCrucigramas = await db.schema.hasTable("crucigramas");
  if (!tieneCrucigramas) {
    await db.schema.createTable("crucigramas", (t) => {
      t.increments("id").primary();
      t.integer("usuario_id")
        .notNullable()
        .references("id").inTable("usuarios")
        .onDelete("CASCADE");
      t.string("titulo").notNullable();
      t.text("palabras").notNullable();                      // JSON: [{word:"...", clue:"..."}]
      t.text("grid_data");                                   // JSON: {grid, placed, rows, cols}
      t.timestamp("creado_en").defaultTo(db.fn.now());
    });
    console.log("✅ Tabla crucigramas creada");
  }

  // ── TABLA: ahorcados ────────────────────────────────────────────
  // Almacena los juegos de ahorcado creados por los usuarios.
  // palabras guarda array de {word, pista} para cada ronda.
  // Campos: id, usuario_id, titulo, palabras (JSON), creado_en
  const tieneAhorcados = await db.schema.hasTable("ahorcados");
  if (!tieneAhorcados) {
    await db.schema.createTable("ahorcados", (t) => {
      t.increments("id").primary();
      t.integer("usuario_id")
        .notNullable()
        .references("id").inTable("usuarios")
        .onDelete("CASCADE");
      t.string("titulo").notNullable();
      t.text("palabras").notNullable();                      // JSON: [{word:"...", pista:"..."}]
      t.timestamp("creado_en").defaultTo(db.fn.now());
    });
    console.log("✅ Tabla ahorcados creada");
  }

  // ── TABLA: sesiones ─────────────────────────────────────────────
  // Registra cada inicio de sesión (maestro o usuario).
  // Útil para auditoría y estadísticas de acceso.
  // Campos: id, tipo ("maestro"/"usuario"), ref_id, ip, creado_en
  const tieneSesiones = await db.schema.hasTable("sesiones");
  if (!tieneSesiones) {
    await db.schema.createTable("sesiones", (t) => {
      t.increments("id").primary();
      t.string("tipo").notNullable();                        // "maestro" o "usuario"
      t.integer("ref_id").notNullable();                     // ID del maestro o usuario que inició sesión
      t.string("ip");                                        // IP desde donde se conectó
      t.timestamp("creado_en").defaultTo(db.fn.now());
    });
    console.log("✅ Tabla sesiones creada");
  }

  // ── MAESTROS INICIALES ──────────────────────────────────────────
  // Lista de maestros que se crean automáticamente al iniciar
  // el servidor por primera vez.
  //
  // ⚠️ PARA AGREGAR UN NUEVO MAESTRO:
  //    Agrega un objeto al array con este formato:
  //    { username: "NuevoMaestro", password: "SuContraseña", nombre: "Nombre Completo" }
  //    Guarda y reinicia el servidor. Se creará solo si no existe.
  //
  // ⚠️ PARA CAMBIAR UNA CONTRASEÑA:
  //    Cambia el valor de password aquí, ELIMINA el registro de la
  //    base de datos manualmente, y reinicia el servidor.
  //    O usa la opción de editar usuario desde el panel del maestro.
  const maestrosIniciales = [
    { username: "LicNyla",  password: "Usermaestro1", nombre: "Lic. Nyla"  },
    { username: "LicNorma", password: "Usermaestro2", nombre: "Lic. Norma" },
    { username: "vargas",   password: "Usermaestro3", nombre: "Vargas"     },
    // ── Agrega más maestros aquí ──────────────────────────────────
    // { username: "NuevoMaestro", password: "SuContraseña", nombre: "Nombre Completo" },
  ];

  for (const m of maestrosIniciales) {
    const existe = await db("maestros").where({ username: m.username }).first();
    if (!existe) {
      // La contraseña se encripta con bcrypt antes de guardarla
      const hash = bcrypt.hashSync(m.password, 10);
      await db("maestros").insert({ username: m.username, password: hash, nombre: m.nombre });
      console.log(`✅ Maestro creado: ${m.username}`);
    }
  }

  console.log("\n🚀 Base de datos lista\n");
}

module.exports = initDB;
