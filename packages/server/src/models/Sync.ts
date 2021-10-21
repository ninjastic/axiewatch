import { Model, JSONSchema, RelationMappings } from 'objection';

import User from './User';

type ScholarState = {
  name: string;
  address: string;
  shares: {
    manager: number;
    scholar: number;
    investor: number;
  };
  inactive: boolean;
  paymentAddress: string;
};

export default class Sync extends Model {
  id!: number;

  user_id!: string;

  data: ScholarState[];

  static tableName = 'sync';

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['user_id', 'data'],
    properties: {
      id: { type: 'integer' },
      user_id: { type: 'string' },
      data: { type: 'array' },
    },
  };

  static relationMappings = (): RelationMappings => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'sync.user_id',
        to: 'users.id',
      },
    },
  });
}
