const { Router } = require('express');

const NotesControllers = require('../controllers/NotesControllers')

const notesControllers = new NotesControllers();

const notesRoutes = Router();

notesRoutes.get("/", notesControllers.index);
notesRoutes.post("/:user_id", notesControllers.create);
notesRoutes.get("/:id", notesControllers.show);
notesRoutes.delete("/:id", notesControllers.delete);



module.exports = notesRoutes;