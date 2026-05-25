document.addEventListener("DOMContentLoaded", () => {
  // Listar las tareas al cargar la página (READ)
  obtenerTareas();

  // Capturar el evento submit del formulario (CREATE)
  const formulario = document.getElementById("formularioTarea");
  formulario.addEventListener("submit", crearTarea);
});
// --- FUNCIÓN READ (Adaptada a tu servidor local) ---
function obtenerTareas() {
  // Apuntamos a tu dirección local de la captura
  fetch('http://localhost:3000/task')
    .then(respuesta => respuesta.json())
    .then(tareas => {
      const listaUL = document.getElementById("listaTareas");
      listaUL.innerHTML = "";

      // Recorremos las tareas de tu servidor local
      tareas.forEach(tarea => {
        const li = document.createElement("li");

        // CAMBIO CLAVE: Usamos .texto en lugar de .title porque así viene en tu JSON
        const textoTarea = document.createElement("span");
        textoTarea.textContent = tarea.texto;

        const contenedorBotones = document.createElement("div");
        contenedorBotones.className = "acciones-tarea";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => {
          // Pasamos tarea.texto aquí también
          actualizarTarea(tarea.id, tarea.texto);
        });

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => {
          eliminarTarea(tarea.id);
        });

        contenedorBotones.appendChild(btnEditar);
        contenedorBotones.appendChild(btnEliminar);
        li.appendChild(textoTarea);
        li.appendChild(contenedorBotones);
        listaUL.appendChild(li);
      });
    })
    .catch(error => console.error("Error al obtener tareas desde localhost:", error));
}

// --- FUNCIÓN CREATE (Crear tarea) ---
function crearTarea(evento) {
  evento.preventDefault();
  const input = document.getElementById("inputTarea");
  const tituloTarea = input.value.trim();

  if (tituloTarea === "") return;

  const nuevaTarea = { title: tituloTarea, completed: false, userId: 1 };

  fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify(nuevaTarea),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  })
    .then(respuesta => respuesta.json())
    .then(datosServidor => {
      console.log("Tarea creada en el servidor:", datosServidor);
      input.value = "";
      obtenerTareas();
    })
    .catch(error => console.error("Error al crear la tarea:", error));
}

// --- FUNCIÓN UPDATE (Actualizar tarea) ---
function actualizarTarea(id, tituloActual) {
  // • Permitan cambiar el nombre de una tarea con un prompt
  const nuevoTitulo = prompt("Modifica el nombre de la tarea:", tituloActual);

  // Si el usuario cancela el prompt o lo deja vacío, no hacemos nada
  if (nuevoTitulo === null || nuevoTitulo.trim() === "") return;

  const tareaActualizada = {
    id: id,
    title: nuevoTitulo.trim(),
    completed: false,
    userId: 1
  };

  // • Envíen una petición PUT o PATCH
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tareaActualizada),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  })
    .then(respuesta => respuesta.json())
    .then(datosActualizados => {
      console.log(`Servidor responde a PUT (Tarea ${id} modificada):`, datosActualizados);

      // • Refresquen la información mostrada
      obtenerTareas();
    })
    .catch(error => console.error("Error al actualizar la tarea:", error));
}

// --- FUNCIÓN DELETE (Eliminar tarea) ---
function eliminarTarea(id) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: 'DELETE',
  })
    .then(respuesta => {
      if (respuesta.ok) {
        console.log(`Servidor responde a DELETE: Tarea con ID ${id} eliminada.`);
        obtenerTareas();
      }
    })
    .catch(error => console.error("Error al eliminar la tarea:", error));
}