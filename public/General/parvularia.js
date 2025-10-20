// Cerrar sesión
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../InicioSesion/Inicio.html';
});

// Materias / Actividades de Parvularia
const materiasParvularia = [
    "Autoestima y Autoconcepto",
    "Responsabilidad y Organización",
    "Vínculos y Amistad",
    "Emociones y Empatía",
    "Juegos Colaborativos",
    "Normas y Convivencia",
    "Observación de la Naturaleza",
    "Experimentación y Hipótesis",
    "Explicaciones de Cambios",
    "Causa-Efecto",
    "Electrodomésticos y Mecanismos",
    "Resolución de Problemas",
    "Programación Básica",
    "Creatividad e Innovación",
    "Seguir Instrucciones",
    "Medición y Comparación",
    "Series y Patrones",
    "Secuencias Temporales",
    "Conteo y Números",
    "Suma y Resta",
    "Comparación de Números",
    "Posición y Direccionalidad",
    "Figuras Geométricas",
    "Sonidos e Instrumentos",
    "Música y Ritmo",
    "Opiniones y Expresiones",
    "Arte y Creación",
    "Dramatización",
    "Juegos Dramáticos",
    "Gestos y Comunicación",
    "Metáforas y Bromas",
    "Lectura y Poesía",
    "Textos Narrativos",
    "Lectoescritura",
    "Vocabulario",
    "Rimas",
    "Escritura y Grafías",
    "Lateralidad",
    "Control Corporal",
    "Movimientos Coordinados",
    "Autocuidado",
    "Números y Formas",
    "Comunicación",
    "Ciencia y Tecnología",
    "Ciudadanía y Valores",
    "Desarrollo Corporal",
    "Artes"
];

const grid = document.querySelector('.subjects-grid');
grid.innerHTML = "";

// Generar tarjetas de materias
materiasParvularia.forEach(materia => {
    const card = document.createElement('div');
    card.classList.add('subject-card');
    card.innerHTML = `
        <h3>${materia}</h3>
        <p>Ver Grados y Estudiantes</p>
        <button class="acceder-btn">Acceder</button>
        <div class="grados-container">
            <button>Parvularia 4</button>
            <button>Parvularia 5</button>
            <button>Parvularia 6</button>
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

// Redirigir a la página de grados con clave correcta
grid.querySelectorAll('.grados-container button').forEach(btn => {
    btn.addEventListener('click', () => {
        let grado = btn.textContent.trim();
        if(grado === "Parvularia 4") grado = "parvularia4";
        else if(grado === "Parvularia 5") grado = "parvularia5";
        else if(grado === "Parvularia 6") grado = "parvularia6";
        window.location.href = `Grados/ParvulariaG.html?grado=${grado}`;
    });
});
