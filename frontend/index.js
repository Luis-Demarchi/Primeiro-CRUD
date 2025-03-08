document.getElementById('singupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const data = { name, email, senha };

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        const notification = document.getElementById('notification');

        if (data.status === 'sucesso') {
            notification.classList.add('success');
            notification.classList.remove('error');
            notification.textContent = data.message;
            fetchUsers();
        } else {
            notification.classList.add('error');
            notification.classList.remove('success');
            notification.textContent = data.message;
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    })
});

document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();
});

function fetchUsers(searchTerm = '') {
    fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(data => {
        const usersTable = document.getElementById('usersTable');
        usersTable.innerHTML = '';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>E-mail</th>
                <th>Actions</th>
            </tr>
        `;
        usersTable.appendChild(thead);

        const tbody = document.createElement('tbody');

        let filteredUsers = data;

        if (searchTerm.trim() !== '') {
            filteredUsers = data.filter(user =>
                user.id.toString().includes(searchTerm) ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filteredUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.senha}')">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        usersTable.appendChild(tbody);
    })
    .catch(error => console.error("Erro ao buscar usuários:", error));
}

document.getElementById('searchInput').addEventListener('input', function(){
    const searchTerm = this.value;
    fetchUsers(searchTerm);
})


function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value;
    fetchUsers(searchTerm);
}

function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data=>{
        const notification = document.getElementById('notification');
        if (data.status === 'sucesso') {
            notification.classList.add('success');
            notification.classList.remove('error');
            notification.textContent = data.message;
        } else {
            notification.classList.add('error');
            notification.classList.remove('success');
            notification.textContent = data.message;
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);

        fetchUsers();
    })
    .catch(error => {
        console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('editModal').style.display = 'none';
});

function editUser(id, name, email, senha) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editSenha').value = senha;

    document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const senha = document.getElementById('editSenha').value;

    const data = { name, email, senha };

    fetch(`http://localhost:3000/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        const notification = document.getElementById('editNotification');

        if (data.status === 'sucesso') {
            notification.classList.add('success');
            notification.classList.remove('error');
            notification.textContent = data.message;
            fetchUsers();
            document.getElementById('editModal').style.display = 'none';
        } else {
            notification.classList.add('error');
            notification.classList.remove('success');
            notification.textContent = 'Erro ao editar usuário';
        }

        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    })
    .catch(error => {
        console.error('Erro ao editar usuário:', error);
    });
});