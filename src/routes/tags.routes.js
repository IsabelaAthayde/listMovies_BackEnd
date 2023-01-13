const { Router } = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const TagsControllers = require('../controllers/TagsControllers')

const tagsRoutes = Router();

const tagsControllers = new TagsControllers();

tagsRoutes.get("/", ensureAuthenticated, tagsControllers.index);

module.exports = tagsRoutes;