import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

//const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({
  connectionString,
  max: 20,
});

export const db = drizzle(pool);

export async function closeDbConnection() {
  await pool.end();
}

// // Use this in your app's shutdown logic
// process.on('SIGINT', async () => {
//   await closeDbConnection();
//   process.exit(0);
// });