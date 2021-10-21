import Knex from 'knex';
import { Model } from 'objection';

export const database = Knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: Number(process.env.DATABASE_PORT || 5432),
    password: process.env.DATABASE_PASSWORD,
    db: process.env.DATABASE_NAME,
  },
});

Model.knex(database);
