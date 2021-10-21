import { Model, RelationMappings } from 'objection';

import User from './User';

export default class Dashboard extends Model {
  id!: number;

  user_id!: string;

  logo: string;

  whitelist: string | null;

  type!: number;

  slug!: string;

  createdAt!: string;

  static tableName = 'dashboard';

  static relationMappings = (): RelationMappings => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'dashboard.user_id',
        to: 'users.id',
      },
    },
  });
}
