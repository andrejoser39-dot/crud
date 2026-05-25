const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// 1. CREAR UNA TAREA (POST)
async function crearTarea(titulo, userId = 1) {
  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        title: titulo,
        completed: false,
        userId: userId
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const nuevaTarea = await respuesta.json();
    console.log(' Tarea creada con éxito:', nuevaTarea);
    return nuevaTarea;
  } catch (error) {
    console.error(' Error al crear la tarea:', error);
  }
}

// 2. LISTAR TAREAS (GET)
// Limita el resultado a las primeras 'limite' tareas para no saturar la consola
async function listarTareas(limite = 5) {
  try {
    const respuesta = await fetch(`${API_URL}?_limit=${limite}`);
    const tareas = await respuesta.json();
    console.log(`\n📋 Lista de las primeras ${limite} tareas:`);
    console.table(tareas.map(t => ({ ID: t.id, Título: t.title, Completada: t.completed })));
    return tareas;
  } catch (error) {
    console.error(' Error al listar las tareas:', error);
  }
}

// 3. ACTUALIZAR EL NOMBRE DE UNA TAREA (PATCH)
async function actualizarNombreTarea(id, nuevoTitulo) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: nuevoTitulo
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const tareaActualizada = await respuesta.json();
    console.log(`\n🔄 Tarea con ID ${id} actualizada con éxito:`, tareaActualizada);
    return tareaActualizada;
  } catch (error) {
    console.error(` Error al actualizar la tarea ${id}:`, error);
  }
}

// 4. ELIMINAR UNA TAREA (DELETE)
async function eliminarTarea(id) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (respuesta.ok) {
      console.log(`\n Tarea con ID ${id} eliminada correctamente (Simulado).`);
    }
  } catch (error) {
    console.error(` Error al eliminar la tarea ${id}:`, error);
  }
}

// === EJECUCIÓN DE LAS PRUEBAS ===
async function ejecutarGestor() {
  console.log('--- INICIANDO PRUEBAS DEL GESTOR DE TAREAS ---');

  // Paso 1: Listar tareas actuales
  await listarTareas(5);

  // Paso 2: Crear una nueva tarea
  await crearTarea('Aprender a conectar APIs en el SENA');

  // Paso 3: Actualizar el nombre de una tarea (por ejemplo, la tarea con ID 1)
  await actualizarNombreTarea(1, 'Estudiar para el examen de desarrollo web');

  // Paso 4: Eliminar una tarea (por ejemplo, la tarea con ID 2)
  await eliminarTarea(2);

  console.log('\n--- PRUEBAS FINALIZADAS ---');
}

ejecutarGestor();