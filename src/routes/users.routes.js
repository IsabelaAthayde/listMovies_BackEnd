const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const UsersControllers = require('../controllers/UsersController')
const UserAvatarController = require('../controllers/UserAvatarController')

const usersControllers = new UsersControllers();
const userAvatarController = new UserAvatarController()

const upload = multer(uploadConfig.MULTER)

const userRoutes = Router();

userRoutes.post("/", usersControllers.create);
userRoutes.put("/", ensureAuthenticated, usersControllers.update)
userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

module.exports = userRoutes;