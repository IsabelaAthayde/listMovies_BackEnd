const AppError = require("../utils/AppError");

class UsersControllers {
    create(request, response) {
        const { name, email, password } = request.body;

        if(!name || !email) {
            throw new AppError('Você precisa preencher todos com os campos (nome, email e senha)')
        }

        response.status(201).json({ name, email, password });
    }
}

module.exports = UsersControllers;