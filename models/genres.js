const pool = require('./pool');

async function getGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
}

// async function postMessage(messageText, messageUser) {
//   await pool.query('INSERT INTO messages (text, username) VALUES ($1, $2)', [
//     messageText,
//     messageUser,
//   ]);
// }

// async function getMessageById(messageId) {
//   const { rows } = await pool.query('SELECT * FROM messages WHERE id = $1', [
//     messageId,
//   ]);
//   return rows[0] || null;
// }

module.exports = { getGenres };
