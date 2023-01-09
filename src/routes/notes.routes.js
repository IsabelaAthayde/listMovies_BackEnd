const { Router } = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const NotesControllers = require('../controllers/NotesControllers')

const notesControllers = new NotesControllers();

const notesRoutes = Router();

notesRoutes.use(ensureAuthenticated)

notesRoutes.get("/", notesControllers.index);
notesRoutes.post("/", notesControllers.create);
notesRoutes.get("/:id", notesControllers.show);
notesRoutes.delete("/:id", notesControllers.delete);



module.exports = notesRoutes;