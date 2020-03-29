const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('./configs/upload-firebase');

const EstablishmentController = require('./controllers/EstablishmentController');

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/list', EstablishmentController.index);
routes.post('/store', upload.single('thumbnail'), EstablishmentController.store);
routes.post('/login', EstablishmentController.login);

module.exports = routes;