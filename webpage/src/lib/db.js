import { Pool } from 'pg';

// Configure the connection pool
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_ENDPOINT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Export a reusable query function
export const query = (text, params) => pool.query(text, params);

export default pool;
