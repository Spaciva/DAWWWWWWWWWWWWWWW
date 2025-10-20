// public/InicioSesion/Inicio.js (o ruta equivalente)
document.addEventListener("DOMContentLoaded", function () {
  /* =====================
     LOGIN
  ===================== */
  const formLogin = document.getElementById("loginForm");
  const msgLogin  = document.getElementById("mensaje");

  if (formLogin) {
    formLogin.addEventListener("submit", async function (e) {
      e.preventDefault();

      const usuario    = document.getElementById("usuario")?.value.trim() || "";
      const contrasena = document.getElementById("contrasena")?.value.trim() || "";

      if (!usuario || !contrasena) {
        if (msgLogin) msgLogin.textContent = "Completa usuario y contraseña.";
        return;
      }

      try {
        const resp = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario, contrasena })
        });
        const data = await resp.json();

        if (!resp.ok || !data.ok) {
          if (msgLogin) msgLogin.textContent = data.error || "Credenciales inválidas";
          return;
        }

        sessionStorage.setItem("nombreAlumno", data.user?.nombre || usuario);
        sessionStorage.setItem("rol", data.user?.rol || "alumno");

        // Redirección por rol:
        const rol = (data.user?.rol || "alumno").toLowerCase();
        if (rol === "maestro") {
          window.location.href = "../registrar.html?rol=maestro";
        } else if (rol === "alumno") {
          window.location.href = "../Estudiantes/PrincipalAlum.html";
        } else {
          // admin u otros
          window.location.href = "../parvularia.html";
        }
      } catch (err) {
        console.error(err);
        if (msgLogin) msgLogin.textContent = "Error de conexión con el servidor.";
      }
    });
  }

  /* =====================
     BOTONES: REGISTRAR ESTUDIANTE / DOCENTE
  ===================== */
  const btnRegistrarEst = document.getElementById("btnRegistrarEst");
  const btnRegistrarDoc = document.getElementById("btnRegistrarDoc");

  if (btnRegistrarEst) {
    btnRegistrarEst.addEventListener("click", () => {
      window.location.href = "../registrar.html?rol=alumno";
    });
  }
  if (btnRegistrarDoc) {
    btnRegistrarDoc.addEventListener("click", () => {
      window.location.href = "../registrar.html?rol=maestro";
    });
  }

  /* =====================
     BLOQUE: CREAR NUEVO USUARIO
  ===================== */
  const btnToggleCrear  = document.getElementById("btnToggleCrear");
  const crearUsuarioBox = document.getElementById("crearUsuarioBox");
  const formCrear       = document.getElementById("formCrearUsuario");
  const msgCrear        = document.getElementById("msgCrearUsuario");

  // Mostrar/Ocultar bloque de creación
  if (btnToggleCrear && crearUsuarioBox) {
    btnToggleCrear.addEventListener("click", () => {
      const visible = crearUsuarioBox.style.display !== "none";
      crearUsuarioBox.style.display = visible ? "none" : "block";
      if (msgCrear) msgCrear.textContent = "";
    });
  }

  // Enviar creación a /api/usuarios
  if (formCrear) {
    formCrear.addEventListener("submit", async (e) => {
      e.preventDefault();
      const usuarioNuevo    = document.getElementById("nuevoUsuario")?.value.trim() || "";
      const contrasenaNueva = document.getElementById("nuevaContrasena")?.value.trim() || "";
      const rolNuevo        = document.getElementById("nuevoRol")?.value || "alumno";

      if (!usuarioNuevo || !contrasenaNueva) {
        if (msgCrear) msgCrear.textContent = "Completa correo y contraseña.";
        return;
      }

      try {
        const r = await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: usuarioNuevo,
            contrasena: contrasenaNueva,
            rol: rolNuevo
          })
        });
        const data = await r.json();

        if (data.ok) {
          if (msgCrear) msgCrear.textContent = "✅ Usuario creado.";

          // Si el rol elegido es "maestro", redirige directo a registrar.html
          const rolSel = document.getElementById("nuevoRol")?.value || "alumno";
          if (rolSel.toLowerCase() === "maestro") {
            window.location.href = "../registrar.html?rol=maestro";
            return;
          }

          // Para otros roles, limpia el form
          formCrear.reset();
        } else {
          if (msgCrear) msgCrear.textContent = "❌ " + (data.error || "Error al crear");
        }
      } catch (err) {
        console.error(err);
        if (msgCrear) msgCrear.textContent = "❌ Error de red/servidor";
      }
    });
  }

  /* =====================
     ATAJOS DENTRO DEL BLOQUE CREAR
  ===================== */
/* =====================
   REGISTRO ÚNICO: SELECT + BOTÓN
===================== */
const selRolRegistro = document.getElementById("rolRegistro");
const btnRegistrar   = document.getElementById("btnRegistrar");

if (btnRegistrar && selRolRegistro) {
  btnRegistrar.addEventListener("click", () => {
    const rol = (selRolRegistro.value || "alumno").toLowerCase();
    // Usa ruta absoluta a /public/General/registrar.html
    window.location.href = `/General/registrar.html?rol=${rol}`;
  });
}

});

