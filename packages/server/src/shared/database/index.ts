import knex, { Knex } from 'knex';
import { Model } from 'objection';

import config from '../../config/knex';

const connection: Knex = knex(config);

Model.knex(connection);

export default connection;
