import { Model, RelationMappings } from 'objection';

import Dashboard from './Dashboard';
import Sync from './Sync';

export default class User extends Model {
  id!: string;

  email!: string;

  static tableName = 'users';

  static relationMappings = (): RelationMappings => ({
    sync: {
      relation: Model.HasOneRelation,
      modelClass: Sync,
      join: {
        from: 'users.id',
        to: 'sync.user_id',
      },
    },
    dashboard: {
      relation: Model.HasOneRelation,
      modelClass: Dashboard,
      join: {
        from: 'users.id',
        to: 'dashboard.user_id',
      },
    },
  });
}
