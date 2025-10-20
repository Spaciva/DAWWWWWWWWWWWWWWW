// public/General/registrar.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registrationForm');

  // Secciones por rol (deben existir en registrar.html)
  const seccionAlumno  = document.getElementById('seccionAlumno');
  const seccionMaestro = document.getElementById('seccionMaestro');
  const rolSelect      = document.getElementById('rol'); // opcional

  // Discapacidad (opcional si lo usas en Alumno)
  const disabilitySelect     = document.getElementById('discapacidad');
  const disabilityOptionsDiv = document.getElementById('disabilityOptions');

  /* ---------- Mostrar/ocultar opciones de discapacidad ---------- */
  function toggleDisabilityOptions() {
    if (!disabilitySelect || !disabilityOptionsDiv) return;
    disabilityOptionsDiv.style.display = (disabilitySelect.value === 'Sí') ? 'block' : 'none';
  }
  if (disabilitySelect) {
    disabilitySelect.addEventListener('change', toggleDisabilityOptions);
  }

  /* ---------- UI por rol (alumno / maestro) ---------- */
  function applyRoleUI(rol) {
    const r = (rol || '').toLowerCase();
    const showMaestro = (r === 'maestro');

    // Mostrar/Ocultar secciones
    if (seccionAlumno)  seccionAlumno.style.display  = showMaestro ? 'none'  : 'block';
    if (seccionMaestro) seccionMaestro.style.display = showMaestro ? 'block' : 'none';

    // Habilitar/Deshabilitar campos según sección visible
    const toggleDisabled = (container, disabled) => {
      if (!container) return;
      container.querySelectorAll('input, select, textarea').forEach(el => {
        el.disabled = disabled;
      });
    };
    toggleDisabled(seccionAlumno,  showMaestro);   // si maestro, alumno disabled
    toggleDisabled(seccionMaestro, !showMaestro);  // si maestro, maestro enabled

    // Sincroniza el select de rol si existe
    if (rolSelect && (r === 'alumno' || r === 'maestro')) {
      rolSelect.value = r;
    }
  }

  // Exponer helpers (por si los llamamos tras reset)
  window.applyRoleUI = applyRoleUI;
  window.toggleDisabilityOptions = toggleDisabilityOptions;

  // Lee ?rol=alumno|maestro y aplica UI
  (function initRole() {
    const params = new URLSearchParams(window.location.search);
    const rol = (params.get('rol') || '').toLowerCase();
    applyRoleUI(rol === 'maestro' ? 'maestro' : 'alumno');
  })();

  // Si cambian el <select id="rol">, alterna UI
  if (rolSelect) {
    rolSelect.addEventListener('change', () => applyRoleUI(rolSelect.value));
  }

  // Mostrar/ocultar discapacidad al cargar
  toggleDisabilityOptions();

  /* ---------- Envío del formulario ---------- */
if (form) {
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateForm()) return;

    // Solo tomamos campos habilitados (sección visible)
    const enabledFields = Array.from(
      form.querySelectorAll('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')
    );
    const payload = {};
    enabledFields.forEach(el => { payload[el.id] = el.value; });

    // Rol activo (select o parámetro ?rol=)
    const rolActual = (document.getElementById('rol')?.value
                      || new URLSearchParams(location.search).get('rol')
                      || 'alumno').toLowerCase();

    const urlRegistro = (rolActual === 'maestro')
      ? '/api/registro/maestro'
      : '/api/registro/alumno';

    try {
      // 1) Guarda en su tabla (alumno/maestro)
      const r1 = await fetch(urlRegistro, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      const d1 = await r1.json();

      if (!r1.ok || !d1.ok) {
        showErrorMessage(d1.error || 'No se pudo registrar.');
        return;
      }

      // 2) Crea usuario de login en /api/usuarios
      //    - usuario = email (alumno: #email, maestro: #email_maestro)
      //    - contraseña provisional = DUI sin guión, o "1234" si no hay DUI
      let usuarioLogin = '';
      let passwordLogin = '1234';

      if (rolActual === 'maestro') {
        usuarioLogin  = (payload['email_maestro'] || '').trim();
        const duiRaw  = (payload['dui_maestro'] || '').trim();
        if (duiRaw) passwordLogin = duiRaw.replace('-', '');
      } else {
        usuarioLogin  = (payload['email'] || '').trim();
        const duiRaw  = (payload['dui'] || '').trim();
        if (duiRaw) passwordLogin = duiRaw.replace('-', '');
      }

      if (usuarioLogin) {
        const r2 = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({
            usuario: usuarioLogin,
            contrasena: passwordLogin,
            rol: rolActual
          })
        });
        const d2 = await r2.json();
        if (!r2.ok || !d2.ok) {
          // No detengas el flujo; solo informa.
          showErrorMessage('Se registró, pero no se pudo crear el usuario de acceso: ' + (d2.error || ''));
        }
      } else {
        // Si no hay email, solo avisar (registro principal ya quedó)
        showErrorMessage('Se registró, pero no se creó usuario de acceso (falta email).');
      }

      showSuccessMessage('¡Datos registrados con éxito!');
      // Redirecciones post-registro (opcional):
      // if (rolActual === 'maestro') window.location.href = '/General/parvularia.html';
      // else window.location.href = '/Estudiantes/PrincipalAlum.html';

      form.reset();
      applyRoleUI(rolActual); // deja visible la sección del rol actual
      toggleDisabilityOptions();
    } catch (e) {
      console.error(e);
      showErrorMessage('Error de red/servidor');
    }
  });
}

  /* ---------- Validaciones ---------- */
  function validateForm() {
    let isValid = true;
    clearErrorMessages();

    // Solo valida campos habilitados y con required
    const requiredFields = form.querySelectorAll('[required]:not(:disabled)');

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        showErrorMessage(`El campo "${getLabelText(field)}" Campo Obligatorio.`);
        isValid = false;
      } else if (field.type === 'email' && !validateEmail(field.value)) {
        showErrorMessage(`El campo "${getLabelText(field)}" Debe ser un correo electrónico válido.`);
        isValid = false;
      } else if (field.id === 'telefono' && !validatePhone(field.value)) {
        showErrorMessage(`El campo "${getLabelText(field)}" Formato Valido (ej: 7777-8888).`);
        isValid = false;
      } else if ((field.id === 'dui' || field.id === 'dui_maestro') && !validateDUI(field.value)) {
        showErrorMessage(`El campo "${getLabelText(field)}" Formato Valido (ej: 00000000-0).`);
        isValid = false;
      } else if ((field.id === 'telefono_maestro') && !validatePhone(field.value)) {
        showErrorMessage(`El campo "${getLabelText(field)}" Formato Valido (ej: 7777-8888).`);
        isValid = false;
      }
    });

    return isValid;
  }

  function getLabelText(field) {
    const label = form.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace(':', '').trim() : field.id;
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const re = /^\d{4}-\d{4}$/;
    return re.test(phone);
  }

  function validateDUI(dui) {
    const re = /^\d{8}-\d{1}$/;
    return re.test(dui);
  }

  function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.classList.add('success-message');
    successDiv.textContent = message;
    form.parentNode.insertBefore(successDiv, form);
    setTimeout(() => successDiv.remove(), 4000);
  }

  function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    form.parentNode.insertBefore(errorDiv, form);
  }

  function clearErrorMessages() {
    const errorMessages = form.parentNode.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
  }
});
