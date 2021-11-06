exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('sync', {
    id: 'id',
    user_id: {
      type: 'uuid',
      unique: true,
      notNull: true,
      references: '"auth"."users"',
    },
    data: {
      type: 'jsonb',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('sync');
};
