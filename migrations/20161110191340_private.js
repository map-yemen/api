
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('projects', table => {
      table.boolean('private').defaultTo(false).notNullable();
    }),
    knex.schema.table('indicators', table => {
      table.boolean('private').defaultTo(false).notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('projects', table => {
      table.dropColumn('private');
    }),
    knex.schema.table('indicators', table => {
      table.dropColumn('private');
    })
  ]);
};
