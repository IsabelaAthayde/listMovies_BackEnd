const { hash, compare } = require('bcryptjs');
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite/")
const UsersRepository = require("../repositories/UsersRepository");
const UserCreateService = require("../services/UserCreateService");

class UsersControllers {
    async create(request, response) {
        const { name, email, password } = request.body;

        const usersRepository = new UsersRepository();
        const userCreateService = new UserCreateService(usersRepository);
        await userCreateService.execute({ name, email, password })
        

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE ID = (?)", [user_id])

        if (!user) {
            throw new AppError("Usuário não existente, cadastre-se primeiro")
        }

        const userEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        if(userEmail && userEmail.id !== user.id) {
            throw new AppError(`Esse email já está em uso`)
        }
        console.log(user.password)
        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password) {
            throw new AppError(`Senha antiga não informada.`);
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
        [user.name, user.email, user.password, user_id]
        );

        return response.status(202).json();
    }
}

module.exports = UsersControllers;