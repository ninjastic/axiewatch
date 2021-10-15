exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('tracking', {
    id: 'id',
    address: {
      type: 'varchar',
      notNull: true,
    },
    slpAmount: {
      type: 'integer',
      notNull: true,
    },
    arenaElo: {
      type: 'integer',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('tracking', 'address');
  pgm.createIndex('tracking', 'createdAt');
};

exports.down = pgm => {
  pgm.dropTable('tracking');
};
