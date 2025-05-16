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
// async function postMessage(messageText, messageUser) {
//   await pool.query('INSERT INTO messages (text, username) VALUES ($1, $2)', [
//     messageText,
//     messageUser,
//   ]);
// }

module.exports = { getAllGenres, getGenreById };
