import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
  },
  migrations: {
    directory: './src/db/migrations',
  },
};

export const db = knex(dbConfig);

export default dbConfig;