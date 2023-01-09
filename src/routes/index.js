const { Router } = require('express');

const userRouter = require('./users.routes');
const sessionRouter = require('./sessions.routes');
const notesRouter = require('./notes.routes');
const tagsRouter = require('./tags.routes');

const routes = Router();

routes.use('/users', userRouter)
routes.use('/sessions', sessionRouter)
routes.use('/movieNotes', notesRouter)
routes.use('/tags', tagsRouter)


module.exports = routes;