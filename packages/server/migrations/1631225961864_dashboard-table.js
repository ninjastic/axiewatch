exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('dashboard', {
    id: 'id',
    user_id: {
      type: 'uuid',
      unique: true,
      notNull: true,
      references: '"auth"."users"',
    },
    logo: {
      type: 'string',
      notNull: false,
    },
    whitelist: {
      type: 'text',
      notNull: false,
    },
    type: {
      type: 'integer',
      default: 1,
    },
    slug: {
      type: 'string',
      notNull: true,
      unique: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('dashboard', 'user_id');
};

exports.down = pgm => {
  pgm.dropTable('dashboard');
};
