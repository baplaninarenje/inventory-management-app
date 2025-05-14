#! /usr/bin/env node
require('dotenv').config();
const { Client } = require('pg');

const SQL = `CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genrename VARCHAR(255)
);

INSERT INTO genres (genrename)
VALUES
  ('Action'),
  ('Adventure'),
  ('Role-Playing'),
  ('Strategy'),
  ('Simulation');
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
