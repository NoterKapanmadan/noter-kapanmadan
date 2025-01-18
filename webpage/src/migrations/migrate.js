const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const setupVehicleData = require('./setupVehicleData');
require('dotenv').config({ path: '.env.local' });

const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_ENDPOINT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to the database.');

    await client.query(schemaSql);

    await setupVehicleData();

    console.log('Database migration completed successfully.');
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
})();
