#! /usr/bin/env node
require('dotenv').config();
const { Client } = require('pg');

const SQL = `
-- DROP TABLES IF THEY EXIST TO RESET DATA
DROP TABLE IF EXISTS game_genres;
DROP TABLE IF EXISTS game_developers;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS developers;
DROP TABLE IF EXISTS games;

-- CREATE genres TABLE
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genrename VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

-- INSERT sample genres
INSERT INTO genres (genrename, description) VALUES
  ('Action', 'Fast-paced games that require reflexes and coordination.'),
  ('Adventure', 'Story-driven games with exploration and puzzle-solving.'),
  ('Role-Playing (RPG)', 'Games where players assume the roles of characters and develop them through quests.'),
  ('Simulation', 'Games that simulate real-world activities like flying or farming.'),
  ('Strategy', 'Games focused on tactical decision-making and planning.'),
  ('Sports', 'Games that emulate physical sports such as football or racing.'),
  ('Horror', 'Games designed to scare and create a tense atmosphere.'),
  ('Puzzle', 'Games centered around solving logic or pattern-based challenges.'),
  ('Platformer', 'Games involving jumping between platforms and avoiding obstacles.'),
  ('Multiplayer Online Battle Arena (MOBA)', 'Team-based games with strategic combat in an arena.');

-- CREATE games TABLE
CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  release_date DATE,
  description TEXT
);

-- INSERT sample games
INSERT INTO games (title, release_date, description) VALUES
  ('Battle Quest', '2021-11-10', 'An action RPG set in a medieval fantasy world.'),
  ('Farm Life Sim', '2022-05-20', 'A relaxing simulation game where you build and manage your own farm.'),
  ('Zombie Nightmares', '2023-10-31', 'A horror survival game in a zombie-infested city.'),
  ('Galaxy Conqueror', '2020-08-15', 'A space-themed strategy game focused on galactic domination.'),
  ('Puzzle Master', '2024-01-01', 'A challenging puzzle game with hundreds of logic-based levels.');

-- CREATE developers TABLE
CREATE TABLE IF NOT EXISTS developers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  founded_in DATE,
  country VARCHAR(100)
);

-- INSERT sample developers
INSERT INTO developers (name, founded_in, country) VALUES
  ('Iron Pixel Studios', '2015-03-01', 'USA'),
  ('Nebula Interactive', '2012-09-12', 'Canada'),
  ('Red Ape Games', '2018-06-23', 'UK'),
  ('Sunrise Devs', '2020-01-15', 'Japan'),
  ('Midnight Coderz', '2019-11-11', 'Germany');

-- CREATE game_developers TABLE
CREATE TABLE IF NOT EXISTS game_developers (
  game_id INT NOT NULL,
  developer_id INT NOT NULL,
  PRIMARY KEY (game_id, developer_id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE
);

-- INSERT sample game-developer relationships
INSERT INTO game_developers (game_id, developer_id) VALUES
  (1, 1),  -- Battle Quest by Iron Pixel Studios
  (1, 2),  -- Battle Quest also by Nebula Interactive
  (2, 4),  -- Farm Life Sim by Sunrise Devs
  (3, 5),  -- Zombie Nightmares by Midnight Coderz
  (4, 2),  -- Galaxy Conqueror by Nebula Interactive
  (4, 3),  -- Galaxy Conqueror also by Red Ape Games
  (5, 3);  -- Puzzle Master by Red Ape Games

-- CREATE game_genres TABLE
CREATE TABLE IF NOT EXISTS game_genres (
  game_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (game_id, genre_id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- INSERT sample game-genre relationships
INSERT INTO game_genres (game_id, genre_id) VALUES
  (1, 1),  -- Battle Quest: Action
  (1, 3),  -- Battle Quest: RPG
  (2, 4),  -- Farm Life Sim: Simulation
  (3, 7),  -- Zombie Nightmares: Horror
  (4, 5),  -- Galaxy Conqueror: Strategy
  (5, 8);  -- Puzzle Master: Puzzle
`;

async function main() {
  try {
    console.log('seeding...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

main();
