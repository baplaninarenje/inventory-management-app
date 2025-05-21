const gamesModel = require('../models/games');
const { body, validationResult } = require('express-validator');

const validateGenre = [
  body('genrename')
    .trim()
    .notEmpty()
    .withMessage('Genre name is required.')
    .isLength({ max: 20 })
    .withMessage('Genre name must be at most 20 characters long.'),

  body('description')
    .optional({ checkFalsy: true }) // allow empty description
    .trim()
    .isLength({ max: 100 })
    .withMessage('Description must be at most 100 characters long.'),
];

module.exports = {
  // show: async (req, res) => {
  //   const { genreId } = req.params;

  //   try {
  //     const genre = await genresModel.getGenreById(genreId);
  //     if (!genre) {
  //       return res.status(404).send('Genre not found');
  //     }

  //     const games = await gamesModel.getGamesByGenreId(genreId);

  //     res.render('genreDetail', {
  //       genre,
  //       games,
  //     });
  //   } catch (err) {
  //     console.error('Error fetching genre:', err);
  //     res.status(500).send('Server error');
  //   }
  // },

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

  // create: [
  //   validateGenre,
  //   async (req, res) => {
  //     const errors = validationResult(req);

  //     if (!errors.isEmpty()) {
  //       // Map errors array to an object keyed by path for easier use in EJS
  //       const errorObj = {};
  //       errors.array().forEach((err) => {
  //         errorObj[err.path] = err.msg;
  //       });
  //       return res.status(400).render('newGenreForm', {
  //         errors: errorObj,
  //         formData: req.body,
  //       });
  //     }

  //     const { genrename, description } = req.body;

  //     try {
  //       const genre = await genresModel.createGenre({ genrename, description });
  //       res.render('genreCreated', { genre });
  //       return;
  //     } catch (err) {
  //       console.error('Error creating genre:', err);
  //       // Check for unique constraint violation (PostgreSQL error code 23505)
  //       if (err.code === '23505') {
  //         return res.status(400).render('newGenreForm', {
  //           errors: {
  //             genrename:
  //               'Genre name already exists. Please choose a different one.',
  //           },
  //           formData: req.body,
  //         });
  //       }

  //       // Fallback for any other server error
  //       return res.status(500).render('newGenreForm', {
  //         errors: {
  //           general: 'An unexpected error occurred. Please try again later.',
  //         },
  //         formData: req.body,
  //       });
  //     }
  //   },
  // ],

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

  // newGenreForm: (req, res) => {
  //   res.render('newGenreForm', { errors: {}, formData: {} });
  // },
};
