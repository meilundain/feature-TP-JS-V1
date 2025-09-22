const textoNota = document.getElementById("texto-nota");
const btnNuevaNota = document.getElementById("btn-nueva-nota");
const mensajeError = document.getElementById("mensaje-error");

const contenedorBacklog = document.getElementById("backlog")

function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = "block";
}

function mostrarExito() {
    mensajeError.textContent = "";
    mensajeError.style.display = "none";
}

function crearNota(texto) {
    if (texto.trim() === "") {
        mostrarError("Nota vacía");
        return;
    } else {
        mostrarExito();
    }

    const divNota = document.createElement("div");
    divNota.classList.add("nota");

    const notaParrafo = document.createElement("p");

    notaParrafo.textContent = texto;

    const btnBorrarNota = document.createElement("button");
    btnBorrarNota.textContent = "🗑️";
    btnBorrarNota.classList.add("btn-eliminar-nota");

    btnBorrarNota.addEventListener("click", () => {
        divNota.remove();
    })

    divNota.addEventListener("click", () => {
        divNota.classList.toggle("seleccionada");
    })

    divNota.appendChild(notaParrafo);
    divNota.appendChild(btnBorrarNota);

    contenedorBacklog.appendChild(divNota);

    textoNota.value = "";
}

btnNuevaNota.addEventListener("click", () => {
    crearNota(textoNota.value);
})
