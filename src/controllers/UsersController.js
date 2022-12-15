const { hash, compare } = require('bcryptjs');
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite/")

class UsersControllers {
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConnection();
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        console.log(checkUserExists)
        if(checkUserExists) {
            throw new AppError(`Esse email já está em uso`)
        }

        const hashedPassword = await hash(password, 8);

        await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
        [name, email, hashedPassword]);
        

        response.status(201).json();
    }

    async update(request, response) {
        const { id } = request.params;
        const { name, email, password, old_password } = request.body;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE ID = (?)", [id])

        if (!user) {
            throw new AppError("Usuário não existente, cadastre-se primeiro")
        }

        const userEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        if(userEmail && userEmail.id !== id) {
            throw new AppError(`Esse email já está em uso`)
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password) {
            throw new AppError(`Digite a senha antiga para prosseguir.`);
        }

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);
            if(!checkOldPassword) {
                throw new AppError(`A senha Antiga não confere.`);
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE ID = ?
        `,
        [user.name, user.email, user.password, id]
        );

        response.status(202).json();
    }
}

module.exports = UsersControllers;