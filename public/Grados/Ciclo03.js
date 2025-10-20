document.addEventListener("DOMContentLoaded", function() {

    const params = new URLSearchParams(window.location.search);
    let grado = params.get("grado") || "cuarto";

    const messageDiv = document.getElementById('message');
    const table = document.getElementById('studentTable');
    const tituloGrado = document.getElementById("titulo-grado");

    // Alumnos por grado
    const alumnosPorGrado = {
        "cuarto": [
    "Diego Armando Castro Lemus",
    "Javier Alejandro Escobar Díaz",
    "Samuel Antonio García Ayala",
    "Leonardo Andrés Hernández Rivas",
    "Benjamín Eduardo López Cornejo",
    "Miguel Ángel Martínez Pineda",
    "Ariana Estefanía Navarro Torres",
    "Daniela Sofía Pérez Serrano",
    "Luciana Isabel Quinteros Ramos",
    "Camila Gabriela Zelaya Torres"
  ],

  "quinto": [
    "Andrés Felipe Bonilla Campos",
    "Diego Alejandro García Tobar",
    "Sara Valentina Mejía Fuentes",
    "Julia Carolina Vásquez Cruz"
  ],

  "sexto": [
    "Aarón Josué Calderón Molina",
    "Eduardo Rafael Domínguez López",
    "Mateo Esteban Gómez Herrera",
    "Claudia Patricia Hernández Torres",
    "Natalia Beatriz Rivas Menjívar"
  ]
    };

    // Título del grado
    tituloGrado.textContent = "Grado: " + formatoGrado(grado);

    // Cargar alumnos
    cargarEstudiantes();
    cargarDesdeLocalStorage();
    ordenarTabla();

    function formatoGrado(gradoStr){
        switch(gradoStr){
            case "cuarto": return "Cuarto Grado";
            case "quinto": return "Quinto Grado";
            case "sexto": return "Sexto Grado";
            default: return gradoStr;
        }
    }

    function cargarEstudiantes() {
        const tbody = table.tBodies[0];
        tbody.innerHTML = "";
        const alumnos = alumnosPorGrado[grado] || [];

        if(alumnos.length === 0){
            const row = tbody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 3;
            cell.textContent = "No hay estudiantes en este grado.";
            return;
        }

        alumnos.forEach((nombre,index)=>{
            const row = tbody.insertRow();
            const cellIndex = row.insertCell(0);
            const cellNombre = row.insertCell(1);
            const cellPromedio = row.insertCell(2);

            cellIndex.textContent = index+1;
            cellNombre.textContent = nombre;
            cellPromedio.className = "promedio";
            cellPromedio.textContent = "0";
        });
    }

    // ------------------ FUNCIONES DE ACTIVIDADES ------------------
    window.agregarActividad = function() {
        const activity = document.getElementById('activity').value.trim();
        if(!activity){
            mostrarMensaje('Por favor, ingresa un nombre de actividad.', 'error');
            return;
        }

        const headerRow = table.tHead.rows[0];
        const promedioIndex = headerRow.cells.length - 1;

        const newHeader = headerRow.insertCell(promedioIndex);
        newHeader.textContent = activity;

        Array.from(table.tBodies[0].rows).forEach(row=>{
            const newCell = row.insertCell(row.cells.length-1);
            const input = document.createElement('input');
            input.type='number';
            input.className='grade-input';
            input.min=0; input.max=10; input.value=0;
            input.onchange=function(){validarNota(input);};
            newCell.appendChild(input);
        });

        mostrarMensaje(`Actividad "${activity}" agregada.`, 'success');
        document.getElementById('activity').value='';
        guardarEnLocalStorage();
    };

    function validarNota(input){
        let value = input.value.trim();
        if(value===""){value="0"; input.value="0";}
        const num = parseFloat(value);
        if(isNaN(num)||num<0||num>10){
            input.style.borderColor='red';
            mostrarMensaje('La nota debe estar entre 0 y 10.', 'error');
            input.value='0';
        } else {
            input.style.borderColor='';
            calcularPromedio(input);
        }
    }

    function calcularPromedio(input){
        const row = input.closest('tr');
        const inputs = row.querySelectorAll('.grade-input');
        let suma=0, contador=0;
        inputs.forEach(nota=>{
            const val=parseFloat(nota.value);
            if(!isNaN(val)){suma+=val; contador++;}
        });
        const promedioCell = row.querySelector('.promedio');
        promedioCell.textContent=(suma/contador).toFixed(2);
    }

    window.guardarTodasNotas = function(){guardarEnLocalStorage(); mostrarMensaje('Todas las notas se guardaron correctamente.','success');};
    window.actualizarNotas = function(){document.querySelectorAll('.grade-input').forEach(input=>calcularPromedio(input));};

    function guardarEnLocalStorage(){
        const headers = Array.from(table.tHead.rows[0].cells).map(c=>c.textContent);
        const rows = Array.from(table.tBodies[0].rows).map(row=>{
            const nombre = row.cells[1].textContent;
            const notas = Array.from(row.querySelectorAll('.grade-input')).map(i=>i.value);
            const promedio = row.querySelector('.promedio').textContent;
            return {nombre, notas, promedio};
        });
        localStorage.setItem('datos_'+grado,JSON.stringify({headers,rows}));
    }

    function cargarDesdeLocalStorage(){
        const data = JSON.parse(localStorage.getItem('datos_'+grado));
        if(!data) return;

        const headerRow = table.tHead.rows[0];
        while(headerRow.cells.length>3) headerRow.deleteCell(2);

        data.headers.slice(2,-1).forEach(header=>{
            const promedioIndex = headerRow.cells.length-1;
            const newHeader = headerRow.insertCell(promedioIndex);
            newHeader.textContent = header;
        });

        const rows = table.tBodies[0].rows;
        data.rows.forEach((rowData,rIndex)=>{
            const row = rows[rIndex];
            while(row.cells.length>3) row.deleteCell(2);
            rowData.notas.forEach(nota=>{
                const newCell = row.insertCell(row.cells.length-1);
                const input = document.createElement('input');
                input.type='number';
                input.className='grade-input';
                input.value=nota||0;
                input.min=0; input.max=10;
                input.onchange=function(){validarNota(input);};
                newCell.appendChild(input);
            });
            row.querySelector('.promedio').textContent=rowData.promedio||"0";
        });
    }

    function ordenarTabla(){
        const rows = Array.from(table.tBodies[0].rows);
        rows.sort((a,b)=>{
            const nombreA=a.cells[1].textContent.trim();
            const nombreB=b.cells[1].textContent.trim();
            return nombreA.localeCompare(nombreB,'es',{sensitivity:'base'});
        });
        rows.forEach((r,i)=>{r.cells[0].textContent=i+1; table.tBodies[0].appendChild(r);});
    }

    function mostrarMensaje(texto,tipo){
        messageDiv.className='message '+tipo;
        messageDiv.textContent=texto;
        setTimeout(()=>{messageDiv.textContent=''; messageDiv.className='message';},3000);
    }

});
