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

async function getGenreNamesForGame(gameId) {
  const sql = `
    SELECT g.genrename
    FROM genres g
    JOIN game_genres gg ON g.id = gg.genre_id
    WHERE gg.game_id = $1;
  `;
  const result = await pool.query(sql, [gameId]);
  return result.rows.map((row) => row.genrename);
}

async function createGame(title, release_year, description, genre_ids, client) {
  // 1) insert into games ----------------------------------------------
  const insertGameSQL = `
        INSERT INTO games (title, release_year, description)
        VALUES ($1, $2, $3)
        RETURNING id, title, release_year, description;
      `;
  const gameRes = await client.query(insertGameSQL, [
    title,
    release_year || null,
    description || null,
  ]);
  const game = gameRes.rows[0]; // contains the new game_id

  // 2) insert into game_genres ----------------------------------------
  if (genre_ids.length) {
    const placeholders = genre_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
    await client.query(
      `INSERT INTO game_genres (game_id, genre_id) VALUES ${placeholders}`,
      [game.id, ...genre_ids]
    );
  }

  return game;
}

async function updateGame(id, { title, release_year, description }) {
  const query = `
    UPDATE genres
    SET title = $1,
        release_year = $2,
        description = $3
    WHERE id = $4
  `;
  await pool.query(query, [title, release_year, description, id]);
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
  getGenreNamesForGame,
};
