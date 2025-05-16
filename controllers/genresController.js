const genresModel = require('../models/genres');
const { body, validationResult } = require('express-validator');

const validateGenre = [
  body('genrename')
    .trim()
    .notEmpty()
    .withMessage('Genre name is required.')
    .isLength({ max: 255 })
    .withMessage('Genre name must be at most 255 characters long.'),

  body('description')
    .optional({ checkFalsy: true }) // allow empty description
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters long.'),
];

module.exports = {
  index: async (req, res) => {
    try {
      const genres = await genresModel.getAllGenres();

      if (!genres) {
        res.status(404).send('genres not found');
        return;
      }
      res.render('index', { genres });
    } catch (err) {
      console.error('Error fetching genres:', err);
      res.status(500).send('Server error');
    }
  },

  editGenreForm: async (req, res) => {
    const { genreId } = req.params;

    try {
      const genre = await genresModel.getGenreById(genreId);

      if (!genre) {
        res.status(404).send('Genre not found');
        return;
      }

      res.render('editGenreForm', { genre });
    } catch (err) {
      console.error('Error fetching genre:', err);
      res.status(500).send('Server error');
    }
  },

  deleteGenre: async (req, res) => {
    const { genreId } = req.params;

    try {
      const genre = await genresModel.deleteGenreById(genreId);
      res.redirect('/');
      return;
    } catch (err) {
      console.error('Error deleting genre:', err);
      res.status(500).send('Server error');
    }
  },

  newGenreForm: (req, res) => {
    res.render('newGenreForm', { errors: {}, formData: {} });
  },

  create: [
    validateGenre,
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // Map errors array to an object keyed by param for easier use in EJS
        const errorObj = {};
        errors.array().forEach((err) => {
          errorObj[err.param] = err.msg;
        });

        return res.status(400).render('newGenreForm', {
          errors: errorObj,
          formData: req.body,
        });
      }

      const { genrename, description } = req.body;

      try {
        const genre = await genresModel.createGenre({ genrename, description });
        res.render('genreCreated', { genre });
        return;
      } catch (err) {
        console.error('Error creating genre:', err);
        res.status(500).send('Server error');
      }
    },
  ],

  // index: async (req, res) => {
  //   const genres = await genresModel.getAllGenres();

  //   if (!genres) {
  //     res.status(404).send('genres not found');
  //     return;
  //   }
  //   res.render('index', { genres });
  // },
  // index: async (req, res) => {
  //   const genres = await genresModel.getAllGenres();

  //   if (!genres) {
  //     res.status(404).send('genres not found');
  //     return;
  //   }
  //   res.render('index', { genres });
  // },
  // index: async (req, res) => {
  //   const genres = await genresModel.getAllGenres();

  //   if (!genres) {
  //     res.status(404).send('genres not found');
  //     return;
  //   }
  //   res.render('index', { genres });
  // },
};
