const textoNota = document.getElementById("texto-nota");
const btnNuevaNota = document.getElementById("btn-nueva-nota");
const mensajeError = document.getElementById("mensaje-error");
const btnMoverIzq = document.getElementById("mover-izq");
const btnMoverDer = document.getElementById("mover-der");
const tableros = document.querySelectorAll(".tablero");

const contenedorTableros = {
    "backlog": document.getElementById("backlog"),
    "toDo": document.getElementById("toDo"),
    "doing": document.getElementById("doing"),
    "done": document.getElementById("done"),
}
const indicesTableros = ["backlog", "toDo", "doing", "done"]

let notasData = [];
let nextId = 1;

function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.visibility = "visible";
}

function mostrarExito() {
    mensajeError.textContent = "";
    mensajeError.style.visibility = "hidden";
}

function renderizarTableros() {
    tableros.forEach(tablero => {
        const notasExistentes = tablero.querySelectorAll(".nota");
        notasExistentes.forEach(nota => nota.remove());
    })

    notasData.forEach(nota => {
        const notaE = crearElementoNota(nota);
        const contendor = contenedorTableros[nota.tablero]
        if (contendor) {
            contendor.appendChild(notaE)
        }
    })
}

function crearElementoNota(nota) {
    const divNota = document.createElement("div");
    divNota.classList.add("nota");
    divNota.dataset.notaId = nota.id;

    const notaParrafo = document.createElement("p");
    notaParrafo.textContent = nota.texto;

    const btnBorrarNota = document.createElement("button");
    btnBorrarNota.textContent = "🗑️";
    btnBorrarNota.classList.add("btn-eliminar-nota");

    btnBorrarNota.addEventListener("click", (e) => {
        e.stopPropagation();
        BorrarNota(nota.id);
    })

    divNota.addEventListener("click", () => {
        divNota.classList.toggle("seleccionada");
    })

    divNota.appendChild(notaParrafo);
    divNota.appendChild(btnBorrarNota);

    return divNota;
}

function guardarNota(texto) {
    if (texto.trim() === "") {
        mostrarError("Nota vacía");
        return;
    } else {
        mostrarExito();
    }

    const nuevaNota = {
        id: nextId++,
        texto: texto,
        tablero: "backlog",
    }

    notasData.push(nuevaNota);

    guardarEnLocalStorage();
    renderizarTableros();
}

function BorrarNota(notaId) {
    const idABorrar = parseInt(notaId)
    notasData = notasData.filter(nota => nota.id !== idABorrar)

    guardarEnLocalStorage();
    renderizarTableros();
}

function moverNotaSeleccionada(direccion) {
    const notasSeleccionadas = document.querySelectorAll(".nota.seleccionada");

    if (notasSeleccionadas.length === 0) {
        mostrarError("Debe seleccionar al menos una nota")
        return;
    } else {
        mostrarExito();
    }

    notasSeleccionadas.forEach(nota => {
        const notaId = parseInt(nota.dataset.notaId)
        const indiceNota = notasData.findIndex(n => n.id === notaId);

        if (indiceNota === -1) {
            mostrarError("Nota inexistente");
            return;
        } else {
            mostrarExito();
        }

        const notaActual = notasData[indiceNota];
        const tableroActual = notaActual.tablero;
        const indiceTablero = indicesTableros.indexOf(tableroActual);

        let posicionNueva = indiceTablero + direccion;

        if (posicionNueva >= 0 && posicionNueva < indicesTableros.length) {
            const nuevoTablero = indicesTableros[posicionNueva];
            notaActual.tablero = nuevoTablero;
        }

        nota.classList.remove(".seleccionada");
    })

    guardarEnLocalStorage();
    renderizarTableros();
}

function guardarEnLocalStorage() {
    const notasJSON = JSON.stringify(notasData)
    localStorage.setItem("tableroNotas", notasJSON)
}

function cargarDesdeLocalStorage() {
    const notasJSON = localStorage.getItem("tableroNotas")

    if (notasJSON) {
        notasData = JSON.parse(notasJSON)
    }

    if (notasData.length > 0) {
        const maxId = Math.max(...notasData.map(n => n.id))
        nextId = maxId + 1;
    }
}

btnNuevaNota.addEventListener("click", () => {
    guardarNota(textoNota.value);
    textoNota.value = "";
})

btnMoverIzq.addEventListener("click", () => {
    moverNotaSeleccionada(-1);
})

btnMoverDer.addEventListener("click", () => {
    moverNotaSeleccionada(1);
})

cargarDesdeLocalStorage();
renderizarTableros();
