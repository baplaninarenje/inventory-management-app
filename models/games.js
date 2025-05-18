const pool = require('./pool');

async function getGamesByGenreId(genreId) {
  const { rows } = await pool.query(
    `SELECT games.* 
     FROM games
     JOIN game_genres ON games.id = game_genres.game_id
     WHERE game_genres.genre_id = $1`,
    [genreId]
  );
  return rows;
}

module.exports = { getGamesByGenreId };
