import { Knex } from 'knex';
import path from 'path';

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: Number(process.env.DATABASE_PORT || 5432),
    password: process.env.DATABASE_PASSWORD,
    db: process.env.DATABASE_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, '..', 'shared', 'database', 'migrations'),
  },
};

export default config;
