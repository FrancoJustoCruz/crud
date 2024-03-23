const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('id');
const formEdit = document.getElementById('formEditUser');

fetch(`http://localhost:3000/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const { nombre, email, role } = data;
        document.getElementById('nombre').value = nombre;
        document.getElementById('email').value = email;
        document.getElementById('role').value = role;
    });

formEdit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(formEdit);

    const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        body: data
    });

    if (res.status === 200) {
        alert('Usuario actualizado ');
        window.location.href = '/index.html';
    } else {
        alert('Error al actualizar el usuario');
    }
});