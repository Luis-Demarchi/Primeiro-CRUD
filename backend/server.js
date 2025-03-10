const express = require('express');
const mysql = require('mysql2');
const cors =  require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
const { status } = require('express/lib/response');
const { stat } = require('fs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Luisdemarchi1',
    database: 'primeiro_projeto',
});

const promisePool = pool.promise();

app.post('/users', async (req, res) => {
    const  { name, email, senha} = req.body;

    if (!name || !email || !senha) {
        return res.status(400).json({ status:'erro', message: 'Nome, E-mail e senha são obrigatórios'});
    }

    const [existingUser] = await promisePool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
        return res.status(400).json({ status: 'erro', message: 'E-mail já está em uso' });
    }

    try {
        const [result] = await promisePool.execute('INSERT INTO users (name, email, senha) VALUES (?, ?, ?)', [name, email, senha]);
        const newUser = { id: result.insertId, name, email, senha };
        return res.status(200).json({ status: 'sucesso', message: 'Usuário criado com sucesso'});
    } catch (error) {
        return res.status(500).json({ status: 'erro', message: 'Erro ao criar usuário'});
    }
});

app.get('/users', async (req, res) => {
    try {
        const [users] = await promisePool.execute('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status:'erro', message: 'Erro ao buscar usuários'});
    }
});

app.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, senha } = req.body;

    if (!name && !email && !senha) {
        return res.status(400).json({ status: 'erro', message: 'É necessário informar ao menos um campo para atualização'});
    }

    try {
        const [user] = await promisePool.execute('SELECT * FROM users WHERE id = ?', [id]);

        if (user.length === 0) {
            return res.status(404).json({ status:'erro', message: 'Usuário não encontrado'});
        }

        const userToUpdate = user[0];

        if (email) {
            const [existingUser] = await promisePool.execute('SELECT * FROM users WHERE email = ? AND id != ?', [email, id]);
            if (existingUser.length > 0) {
                return res.status(400).json({ status: 'erro', message: 'This email is alread in use'});
        }

        const newUser = {
            id: userToUpdate.id,
            name: name || userToUpdate.name,
            email: email || userToUpdate.email,
            senha: senha || userToUpdate.senha,
        };

        await promisePool.execute('UPDATE users SET name = ?, email = ?, senha = ? WHERE id = ?', [newUser.name, newUser.email, newUser.senha, id]);

        return res.json({
            status: 'sucesso', message: 'User has been updated', data: newUser
        });
        }
    } catch (error) {
        console.error("Erro no PATCH", error);
        res.status(500).json({ status:'erro', message: 'Erro ao atualizar usuário'});
    }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await promisePool.execute('SELECT * FROM users WHERE id = ?', [id]);

        if (user.length === 0) {
            return res.status(404).json({ status:'erro', message: 'E-mail not found'});
        }

        await promisePool.execute('DELETE FROM users WHERE id = ?', [id]);

        return res.json({ status:'sucesso', message: 'User has been deleted'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status:'erro', message: 'Erro ao remover usuário'});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});