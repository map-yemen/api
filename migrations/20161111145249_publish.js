
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('projects', table => {
      table.boolean('published').defaultTo(true).notNullable();
    }),
    knex.schema.table('indicators', table => {
      table.boolean('published').defaultTo(true).notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('projects', table => {
      table.dropColumn('published');
    }),
    knex.schema.table('indicators', table => {
      table.dropColumn('published');
    })
  ]);
};
