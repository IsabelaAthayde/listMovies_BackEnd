const { Router } = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const UsersControllers = require('../controllers/UsersController')

const userRoutes = Router();

const usersControllers = new UsersControllers();

userRoutes.post("/", usersControllers.create);
userRoutes.put("/", ensureAuthenticated, usersControllers.update)

module.exports = userRoutes;