/**
 * EduPuzzle — Dashboard del Maestro
 */
document.addEventListener("DOMContentLoaded", async () => {
  if (!protegerRuta("maestro")) return;
  renderSidebarUser();

  const data = await apiFetch("/maestros/estadisticas");
  if (!data?.exito) return;

  const s = data.datos;
  document.getElementById("stat-usuarios").textContent    = s.totalUsuarios;
  document.getElementById("stat-restantes").textContent   = s.usuarios_restantes;
  document.getElementById("stat-sopas").textContent       = s.totalSopas;
  document.getElementById("stat-crucigramas").textContent = s.totalCrucigramas;

  // Barra de progreso usuarios
  const pct = Math.round((s.totalUsuarios / 15) * 100);
  const bar = document.getElementById("usuarios-bar");
  if (bar) { bar.style.width = pct + "%"; bar.className = `progress-bar ${pct >= 80 ? "red" : pct >= 50 ? "yellow" : "green"}`; }
  const pctLabel = document.getElementById("usuarios-pct");
  if (pctLabel) pctLabel.textContent = `${s.totalUsuarios} / 15 usuarios`;
});
