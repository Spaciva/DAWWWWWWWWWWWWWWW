// Cerrar sesión
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../InicioSesion/Inicio.html';
});

// Materias / Actividades de Parvularia
const materiasParvularia = [
        "Números y Formas",
        "Comunicación",
        "Ciencia y Tecnología",
        "Ciudadanía y Valores",
        "Desarrollo Corporal",
        "Artes"
];

const grid = document.querySelector('.subjects-grid');

// Limpiar grid antes de agregar
grid.innerHTML = "";

// Generar tarjetas de materias de Parvularia
materiasParvularia.forEach(materia => {
    const card = document.createElement('div');
    card.classList.add('subject-card');
    card.innerHTML = `
        <h3>${materia}</h3>
        <p>Ver Grados y Estudiantes</p>
        <button class="acceder-btn">Acceder</button>
        <div class="grados-container">
            <button>Cuarto</button>
            <button>Quinto</button>
            <button>Sexto</button>
        </div>
    `;
    grid.appendChild(card);
});

// Mostrar grados al presionar "Acceder"
grid.querySelectorAll('.acceder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const container = btn.closest('.subject-card').querySelector('.grados-container');
        container.classList.toggle('active');
    });
});

// Redirigir a la página de grados
grid.querySelectorAll('.grados-container button').forEach(btn => {
    btn.addEventListener('click', () => {
        const grado = btn.textContent.trim().toLowerCase();
        window.location.href = `Grados/Ciclo03.html?grado=${grado}`;
    });
});
