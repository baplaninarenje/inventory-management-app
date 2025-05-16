const genresModel = require('../models/genres');

module.exports = {
  index: async (req, res) => {
    const genres = await genresModel.getAllGenres();

    if (!genres) {
      res.status(404).send('genres not found');
      return;
    }
    res.render('index', { genres });
  },

  editGenreForm: async (req, res) => {
    const { genreId } = req.params;
    const genre = await genresModel.getGenreById(genreId);

    if (!genre) {
      res.status(404).send('genre not found');
      return;
    }
    res.render('editGenreForm', { genre });
  },
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
