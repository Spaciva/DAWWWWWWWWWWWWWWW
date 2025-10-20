// ------------------ Cerrar sesión ------------------
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../InicioSesion/Inicio.html';
});

// ------------------ Materias por grado ------------------
const materiasPorGrado = {
    "primero": [
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
        "Autocuidado"
    ],
    "segundo-tercero": [
        "Números y Formas",
        "Comunicación",
        "Ciencia y Tecnología",
        "Ciudadanía y Valores",
        "Desarrollo Corporal",
        "Artes"
    ]
};

const grid = document.querySelector('.subjects-grid');
grid.innerHTML = "";

// Determinar grado actual desde URL
const params = new URLSearchParams(window.location.search);
const gradoActual = params.get("grado")?.toLowerCase() || "primero";

// ------------------ Función para asignar botones según materia ------------------
function obtenerBotonesMateria(materia) {
    if (materiasPorGrado.primero.includes(materia)) {
        return ["Primero"];
    } else if (materiasPorGrado["segundo-tercero"].includes(materia)) {
        return ["Segundo", "Tercer"];
    } else {
        return [];
    }
}

// ------------------ Generar tarjetas de materias ------------------
const todasMaterias = [...materiasPorGrado.primero, ...materiasPorGrado["segundo-tercero"]];

todasMaterias.forEach(materia => {
    const botones = obtenerBotonesMateria(materia);
    const card = document.createElement('div');
    card.classList.add('subject-card');
    card.innerHTML = `
        <h3>${materia}</h3>
        <p>Ver Grados y Estudiantes</p>
        <button class="acceder-btn">Acceder</button>
        <div class="grados-container">
            ${botones.map(b => `<button>${b}</button>`).join('')}
        </div>
    `;
    grid.appendChild(card);
});

// ------------------ Mostrar grados al presionar "Acceder" ------------------
grid.querySelectorAll('.acceder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const container = btn.closest('.subject-card').querySelector('.grados-container');
        container.classList.toggle('active');
    });
});

// ------------------ Redirigir a la página de grados ------------------
grid.querySelectorAll('.grados-container button').forEach(btn => {
    btn.addEventListener('click', () => {
        let grado = btn.textContent.trim().toLowerCase();
        // Ajuste nombres para URL
        if(grado === "primero") grado = "primergrado";
        else if(grado === "segundo") grado = "segundogrado";
        else if(grado === "tercer") grado = "tercergrado";

        window.location.href = `Grados/Ciclo02.html?grado=${grado}`;
    });
});
