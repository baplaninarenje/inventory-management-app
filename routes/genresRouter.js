const { Router } = require('express');
const genresRouter = Router();
const genresController = require('../controllers/genresController');

genresRouter.get('/:genreId/edit', genresController.editGenreForm);
// genresRouter.post('/:genreId/delete', genresController.deleteGenre);
// genresRouter.get('/new', genresController.newGenreForm);
// genresRouter.get('/:genreId', genresController.show);
// genresRouter.post('/:genreId', genresController.update);
// genresRouter.post('/', genresController.create);

module.exports = genresRouter;
