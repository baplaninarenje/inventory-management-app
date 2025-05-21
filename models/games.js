const pool = require('./pool');

async function getAllGames() {
  const { rows } = await pool.query('SELECT * FROM games ORDER BY id ASC');
  return rows;
}

async function getGameById(gameId) {
  const { rows } = await pool.query('SELECT * FROM games WHERE id = $1', [
    gameId,
  ]);
  return rows[0] || null;
}

async function deleteGameById(gameId) {
  await pool.query('DELETE FROM games WHERE id = $1', [gameId]);
}

async function createGame({ title, release_date, description }) {
  const query = `
    INSERT INTO games (title, release_date, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [title, release_date, description];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updateGame(id, { title, release_date, description }) {
  const query = `
    UPDATE genres
    SET title = $1,
        release_date = $2,
        description = $3
    WHERE id = $4
  `;
  await pool.query(query, [title, release_date, description, id]);
}

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

module.exports = {
  getGamesByGenreId,
  getAllGames,
  getGameById,
  deleteGameById,
  createGame,
  updateGame,
};
