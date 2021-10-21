import { Model } from 'objection';

export default class Tracking extends Model {
  id!: number;

  address!: string;

  slpAmount!: number;

  arenaElo: number;

  createdAt!: string;

  updatedAt!: string;

  static tableName = 'tracking';
}
