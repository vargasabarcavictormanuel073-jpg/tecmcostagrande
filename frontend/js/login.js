/**
 * EduPuzzle — Lógica de Login
 */
document.addEventListener("DOMContentLoaded", () => {
  // Si ya está logueado, redirigir
  if (Auth.isLogged()) {
    redirigirPorRol(Auth.getRol());
    return;
  }

  const form = document.getElementById("login-form");
  const btnLogin = document.getElementById("btn-login");
  const tabMaestro = document.getElementById("tab-maestro");
  const tabUsuario = document.getElementById("tab-usuario");
  const rolLabel = document.getElementById("rol-label");

  let rolActual = "maestro";

  tabMaestro.addEventListener("click", () => {
    rolActual = "maestro";
    tabMaestro.classList.add("active");
    tabUsuario.classList.remove("active");
    rolLabel.textContent = "Administrador";
  });

  tabUsuario.addEventListener("click", () => {
    rolActual = "usuario";
    tabUsuario.classList.add("active");
    tabMaestro.classList.remove("active");
    rolLabel.textContent = "Usuario";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      toast("Completa todos los campos", "error");
      return;
    }

    btnLogin.disabled = true;
    btnLogin.textContent = "Ingresando...";

    const endpoint = rolActual === "maestro" ? "/auth/login-maestro" : "/auth/login-usuario";
    const data = await apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    btnLogin.disabled = false;
    btnLogin.textContent = "Ingresar";

    if (!data || !data.exito) {
      toast(data?.mensaje || "Error al iniciar sesión", "error");
      return;
    }

    Auth.set(data.datos.token, { nombre: data.datos.nombre, id: data.datos.id }, data.datos.rol);
    toast("¡Bienvenido!", "success");
    setTimeout(() => redirigirPorRol(data.datos.rol), 600);
  });

  function redirigirPorRol(rol) {
    if (rol === "maestro") window.location.href = "dashboard.html";
    else window.location.href = "sopas.html";
  }
});
