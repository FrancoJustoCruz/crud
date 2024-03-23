fetch("http://localhost:3000/api/users/")
.then((res) => res.json())
.then((data) => {
    const tbody = document.getElementById("tbodyUsers");

    data.forEach(user => {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('btn-delete');
        deleteButton.value = user.id;
        deleteButton.addEventListener('click', () => {
            eliminarUsuario(user.id);
        });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre ?? 'no registrado'}</td>
            <td>${user.email ?? 'no registrado'}</td>
            <td>${user.role ?? 'no registrado'}</td>
            <td><img src="http://localhost:3000/api/imagenes/${user.imagen}" alt="Image" height="50"></td>
            <td>
                <a href="./pages/edit.html?id=${user.id}" class="btn btn-edit">Editar</a>
                <button class="btn-delete btn-edit" value="${user.id}" onclick="eliminarUsuario(${user.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
});

function eliminarUsuario(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
        fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Eliminar la fila del usuario de la tabla
                document.querySelector(`button[value="${id}"]`).closest('tr').remove();
                alert('Usuario eliminado exitosamente');
            } else {
                alert('Error al eliminar el usuario');
            }
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
            alert('Error al eliminar el usuario');
        });
    }
}