const { Router } = require('express');

const SessionsControllers = require('../controllers/SessionsControllers');

const sessionsControllers = new SessionsControllers;

const sessionsRoutes = Router();

sessionsRoutes.post('/', sessionsControllers.create);

module.exports = sessionsRoutes;