const gamesModel = require('../models/games');
const genresModel = require('../models/genres');
const { body, validationResult } = require('express-validator');
const pool = require('../models/pool');

const validateGame = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Game title is required.')
    .isLength({ max: 50 })
    .withMessage('Title must be at most 50 characters long.'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description must be at most 200 characters long.'),

  body('release_year')
    .optional({ checkFalsy: true })
    .isInt({ min: 1980, max: new Date().getFullYear() + 1 })
    .withMessage('Enter a valid year between 1980 and next year.'),

  body('genre_ids').custom((value) => {
    // Ensure value exists and is a non-empty array or a single valid string
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new Error('At least one genre must be selected.');
    }
    return true;
  }),
];

module.exports = {
  show: async (req, res) => {
    const { gameId } = req.params;

    try {
      const game = await gamesModel.getGameById(gameId);
      if (!game) {
        return res.status(404).send('Game not found');
      }

      const genreNames = await gamesModel.getGenreNamesForGame(game.id);

      game.genreNames = genreNames;
      res.render('gameDetails', { game, pageTitle: 'Game Details' });
    } catch (err) {
      console.error('Error fetching game:', err);
      res.status(500).send('Server error');
    }
  },

  // update: [
  //   validateGenre,
  //   async (req, res) => {
  //     const { genreId } = req.params;
  //     const genreDb = await genresModel.getGenreById(genreId);

  //     const errors = validationResult(req);

  //     if (!errors.isEmpty()) {
  //       // Map errors array to an object keyed by path for easier use in EJS
  //       const errorObj = {};
  //       errors.array().forEach((err) => {
  //         errorObj[err.path] = err.msg;
  //       });

  //       return res.status(400).render('editGenreForm', {
  //         genreId,
  //         errors: errorObj,
  //         formData: {
  //           genrename: req.body.genrename,
  //           description: req.body.description,
  //         },
  //         lastValidGenrename: genreDb.genrename,
  //       });
  //     }

  //     try {
  //       await genresModel.updateGenre(genreId, req.body);
  //       res.redirect(`/genres/${genreId}`);
  //     } catch (err) {
  //       console.error('Error updating genre:', err);
  //       // Check for unique constraint violation (PostgreSQL error code 23505)
  //       if (err.code === '23505') {
  //         return res.status(400).render('editGenreForm', {
  //           genreId,
  //           errors: {
  //             genrename:
  //               'Genre name already exists. Please choose a different one.',
  //           },
  //           formData: req.body,
  //         });
  //       }

  //       // Fallback for any other server error
  //       return res.status(500).render('editGenreForm', {
  //         genreId,
  //         errors: {
  //           general: 'An unexpected error occurred. Please try again later.',
  //         },
  //         formData: req.body,
  //       });
  //     }
  //   },
  // ],

  create: [
    validateGame,
    async (req, res) => {
      const errors = validationResult(req);
      const genres = await genresModel.getAllGenres();

      if (!errors.isEmpty()) {
        // Map errors array to an object keyed by path for easier use in EJS
        const errorObj = {};
        errors.array().forEach((err) => {
          errorObj[err.path] = err.msg;
        });

        return res.status(400).render('newGameForm', {
          errors: errorObj,
          formData: req.body,
          genres,
        });
      }

      // ----- gather data ----------------------------------------------------
      const { title, release_year, description } = req.body;

      const genreIds = [].concat(req.body.genre_ids || []); // ensure array

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const game = await gamesModel.createGame(
          title,
          release_year,
          description,
          genreIds,
          client
        );

        await client.query('COMMIT');

        const genreNames = await gamesModel.getGenreNamesForGame(game.id);
        game.genreNames = genreNames;

        res.render('gameDetails', {
          game,
          pageTitle: 'Game Created Successfully',
        });
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating game:', err);

        if (err.code === '23505') {
          return res.status(400).render('newGameForm', {
            errors: {
              title: 'Game name already exists. Please choose a different one.',
            },
            formData: req.body,
            genres,
          });
        }

        // Fallback for any other server error
        return res.status(500).render('newGameForm', {
          errors: {
            general: 'An unexpected error occurred. Please try again later.',
          },
          formData: req.body,
          genres,
        });
      } finally {
        client.release();
      }
    },
  ],

  index: async (req, res) => {
    try {
      const games = await gamesModel.getAllGames();

      if (!games) {
        res.status(404).send('games not found');
        return;
      }
      res.render('allGames', { games });
    } catch (err) {
      console.error('Error fetching games:', err);
      res.status(500).send('Server error');
    }
  },

  // editGenreForm: async (req, res) => {
  //   const { genreId } = req.params;

  //   try {
  //     const genre = await genresModel.getGenreById(genreId);

  //     if (!genre) {
  //       res.status(404).send('Genre not found');
  //       return;
  //     }

  //     res.render('editGenreForm', {
  //       genreId,
  //       errors: {},
  //       formData: {
  //         genrename: genre.genrename,
  //         description: genre.description,
  //       },
  //     });
  //   } catch (err) {
  //     console.error('Error fetching genre:', err);
  //     res.status(500).send('Server error');
  //   }
  // },

  // deleteGenre: async (req, res) => {
  //   const { genreId } = req.params;

  //   try {
  //     const genre = await genresModel.deleteGenreById(genreId);
  //     res.redirect('/');
  //     return;
  //   } catch (err) {
  //     console.error('Error deleting genre:', err);
  //     res.status(500).send('Server error');
  //   }
  // },

  newGameForm: async (req, res) => {
    const genres = await genresModel.getAllGenres();
    res.render('newGameForm', { errors: {}, formData: {}, genres });
  },
};
