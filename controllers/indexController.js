const genresModel = require('../models/genres');

module.exports = {
  get: async (req, res) => {
    const genres = await genresModel.getGenres();

    if (!genres) {
      res.status(404).send('genres not found');
      return;
    }
    res.render('index', { genres });
  },
};
