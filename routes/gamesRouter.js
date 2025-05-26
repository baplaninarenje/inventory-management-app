const { Router } = require('express');
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');

// gamesRouter.get('/:gameId/edit', gamesController.editGameForm);
// gamesRouter.post('/:gameId/delete', gamesController.deleteGame);
gamesRouter.get('/new', gamesController.newGameForm);
// gamesRouter.get('/:gameId', gamesController.show);
// gamesRouter.post('/:gameId', gamesController.update);
gamesRouter.get('/', gamesController.index);
gamesRouter.post('/', gamesController.create);

module.exports = gamesRouter;
