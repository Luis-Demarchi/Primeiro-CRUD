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

function fetchUsers() {
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
                <th>Email</th>
                <th>Actions</th>
            </tr>
        `;
        usersTable.appendChild(thead);

        const tbody = document.createElement('tbody');

        data.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;

        tr.addEventListener('click', function() {
            selectRow(this, user.id,user.name, user.email);
        });

        tbody.appendChild(tr);

        });

        usersTable.appendChild(tbody);
    });
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
        alert(data.message);
        fetchUsers();
    })
    .catch(error => {
        console.error(error);
    });
}