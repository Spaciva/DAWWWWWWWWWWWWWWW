// ======== Datos simulados ========
const alumno = {
  nombre: "Juan Pérez",
  materias: [
    { nombre: "Matemáticas", notas: [9, 8, 8, 9] },
    { nombre: "Lengua y Literatura", notas: [10, 9, 9, 10] },
    { nombre: "Ciencias Naturales", notas: [8, 9, 7, 9] },
    { nombre: "Historia", notas: [9, 8, 8, 9] }
  ]
};

// ======== Elementos del DOM ========
const nombreAlumno = document.getElementById("nombre-alumno");
const materiasContainer = document.getElementById("materias-container");
const materiasSection = document.getElementById("materias-section");
const notasSection = document.getElementById("notas-section");
const materiaTitle = document.getElementById("materia-title");
const notasGrid = document.getElementById("notas-grid");
const promedioCard = document.getElementById("promedio-card");
const volverBtn = document.getElementById("volver-btn");
const logoutBtn = document.getElementById("logout-btn");

// ======== Inicializar ========
nombreAlumno.textContent = alumno.nombre;

// Crear tarjetas de materias
alumno.materias.forEach(m => {
  const card = document.createElement("div");
  card.classList.add("materia-card");
  card.innerHTML = `<h3>${m.nombre}</h3>`;
  card.addEventListener("click", () => mostrarNotas(m));
  materiasContainer.appendChild(card);
});

// ======== Mostrar Notas ========
function mostrarNotas(materia) {
  materiasSection.style.display = "none";
  notasSection.style.display = "block";
  materiaTitle.textContent = materia.nombre;

  // Limpiar notas anteriores
  notasGrid.innerHTML = "";

  // Crear tarjetas para cada nota
  materia.notas.forEach((nota, i) => {
    const notaCard = document.createElement("div");
    notaCard.classList.add("nota-card");
    notaCard.innerHTML = `<p>Nota ${i + 1}</p><h3>${nota}</h3>`;
    notasGrid.appendChild(notaCard);
  });

  // Calcular promedio
  const promedio = (
    materia.notas.reduce((a, b) => a + b, 0) / materia.notas.length
  ).toFixed(2);

  promedioCard.innerHTML = `<p>Promedio</p><h3>${promedio}</h3>`;
}

// ======== Botón Volver ========
volverBtn.addEventListener("click", () => {
  notasSection.style.display = "none";
  materiasSection.style.display = "block";
});

// ======== Botón Cerrar Sesión ========
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = '../InicioSesion/Inicio.html';
});
