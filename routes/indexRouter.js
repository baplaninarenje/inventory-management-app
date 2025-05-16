const { Router } = require('express');
const indexRouter = Router();
const genresController = require('../controllers/genresController');

indexRouter.get('/', genresController.index);

module.exports = indexRouter;
