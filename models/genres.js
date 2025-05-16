const pool = require('./pool');

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
}

async function getGenreById(genreId) {
  const { rows } = await pool.query('SELECT * FROM genres WHERE id = $1', [
    genreId,
  ]);
  return rows[0] || null;
}

async function deleteGenreById(genreId) {
  await pool.query('DELETE FROM genres WHERE id = $1', [genreId]);
}

async function createGenre({ genrename, description }) {
  const query = `
    INSERT INTO genres (genrename, description)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const values = [genrename, description];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

module.exports = { getAllGenres, getGenreById, deleteGenreById, createGenre };
