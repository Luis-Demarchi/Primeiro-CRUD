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

document.getElementById('deleteButton').addEventListener('click', function() {
    event.preventDefault();

    const email = document.getElementById('emailDelete').value; // Usar 'email' para excluir

    if (!email) {
        const notification = document.getElementById('notification');
        notification.classList.add('error');
        notification.classList.remove('success');
        notification.textContent = 'E-mail é obrigatório';
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
        return;
    }

    fetch(`http://localhost:3000/users`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
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