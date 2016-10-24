
exports.up = function(knex, Promise) {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
    .then(() => {
      return knex.schema.createTable('projects', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').unique().notNullable();
        table.string('owner').notNullable();
        table.jsonb('data').notNullable();
        table.timestamps(true);
      });
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects').then(() => {
    return knex.raw('DROP EXTENSION pgcrypto;');
  });
};
