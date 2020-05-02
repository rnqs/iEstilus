const { Router } = require('express');

const routes = Router();

const ManagerController = require('./controllers/ManagerController');
const EstablishmentController = require('./controllers/EstablishmentController');
const ManagerEstablishmentController = require('./controllers/ManagerEstablishmentController')

routes.get('/', EstablishmentController.index);

routes.post('/managers', ManagerController.create);

routes.get('/managers/:firebaseUid/establishments', ManagerEstablishmentController.index);
routes.post('/managers/:firebaseUid/establishments', ManagerEstablishmentController.create);
routes.put('/managers/:firebaseUid/establishments/:establishmentId', ManagerEstablishmentController.edit);
routes.delete('/managers/:firebaseUid/establishments/:establishmentId', ManagerEstablishmentController.delete);

module.exports = routes;