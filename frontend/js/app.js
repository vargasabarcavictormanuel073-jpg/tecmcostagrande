/**
 * EduPuzzle — Utilidades globales del frontend
 *
 * API_URL: En local usa localhost:5000.
 *          En producción (Railway) el servidor sirve el frontend
 *          desde el mismo dominio, así que usamos ruta relativa "/api".
 *          Esto funciona tanto en local como en Railway sin cambios.
 */

const API = "/api";

// ── TOKEN ───────────────────────────────────────────────────────────────────
const Auth = {
  getToken: () => localStorage.getItem("ep_token"),
  getUser:  () => JSON.parse(localStorage.getItem("ep_user") || "null"),
  getRol:   () => localStorage.getItem("ep_rol"),
  set(token, user, rol) {
    localStorage.setItem("ep_token", token);
    localStorage.setItem("ep_user", JSON.stringify(user));
    localStorage.setItem("ep_rol", rol);
  },
  clear() {
    localStorage.removeItem("ep_token");
    localStorage.removeItem("ep_user");
    localStorage.removeItem("ep_rol");
  },
  isLogged: () => !!localStorage.getItem("ep_token"),
};

// ── FETCH HELPER ─────────────────────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res, data;
  try {
    res = await fetch(`${API}${endpoint}`, { ...options, headers });
    data = await res.json();
  } catch (e) {
    toast("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.", "error");
    return null;
  }

  if (res.status === 401) {
    Auth.clear();
    const path = window.location.pathname;
    const indexPath = (path.includes('/Generador_sopas/') || path.includes('/Genera_crusigrama/') || path.includes('/Pagina_Principal/')) 
      ? "../index.html" 
      : "index.html";
    window.location.href = indexPath;
    return null;
  }
  return data;
}

// ── TOAST ────────────────────────────────────────────────────────────────────
function toast(msg, tipo = "") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const t = document.createElement("div");
  t.className = `toast ${tipo}`;
  const icons = { success: "✅", error: "❌", warning: "⚠️" };
  t.innerHTML = `<span>${icons[tipo] || "ℹ️"}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function abrirModal(id) {
  document.getElementById(id)?.classList.add("open");
}
function cerrarModal(id) {
  document.getElementById(id)?.classList.remove("open");
}

// ── PROTEGER RUTA ────────────────────────────────────────────────────────────
function protegerRuta(rolRequerido) {
  const path = window.location.pathname;
  const indexPath = (path.includes('/Generador_sopas/') || path.includes('/Genera_crusigrama/') || path.includes('/Pagina_Principal/')) 
    ? "../index.html" 
    : "index.html";
  
  if (!Auth.isLogged()) {
    window.location.href = indexPath;
    return false;
  }
  if (rolRequerido && Auth.getRol() !== rolRequerido) {
    window.location.href = indexPath;
    return false;
  }
  return true;
}

// ── CERRAR SESIÓN ────────────────────────────────────────────────────────────
function cerrarSesion() {
  Auth.clear();
  // Detectar si estamos en una subcarpeta o en la raíz
  const path = window.location.pathname;
  if (path.includes('/Generador_sopas/') || path.includes('/Genera_crusigrama/') || path.includes('/Pagina_Principal/')) {
    window.location.href = "../index.html";
  } else {
    window.location.href = "index.html";
  }
}

// ── SIDEBAR MÓVIL ────────────────────────────────────────────────────────────
// Abre/cierra el sidebar en pantallas pequeñas con el botón hamburguesa
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  let overlay = document.getElementById("sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sidebar-overlay";
    overlay.className = "sidebar-overlay";
    overlay.onclick = closeSidebar;
    document.body.appendChild(overlay);
  }
  sidebar.classList.toggle("open");
  overlay.classList.toggle("open");
}
function closeSidebar() {
  document.querySelector(".sidebar")?.classList.remove("open");
  document.getElementById("sidebar-overlay")?.classList.remove("open");
}

// ── RENDER SIDEBAR USER ──────────────────────────────────────────────────────
function renderSidebarUser() {
  const user = Auth.getUser();
  if (!user) return;
  const nameEl = document.getElementById("sidebar-user-name");
  const roleEl = document.getElementById("sidebar-user-role");
  const avatarEl = document.getElementById("sidebar-user-avatar");
  if (nameEl) nameEl.textContent = user.nombre || user.username;
  if (roleEl) roleEl.textContent = Auth.getRol() === "maestro" ? "Maestro" : "Usuario";
  if (avatarEl) avatarEl.textContent = (user.nombre || user.username || "U")[0].toUpperCase();
}

// ── FORMATO FECHA ────────────────────────────────────────────────────────────
function formatFecha(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}
