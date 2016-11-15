const seeds = require('../test/fixtures/seed_data');

exports.seed = function (knex, Promise) {
  return knex('projects').del()
    .then(function () {
      return Promise.all(seeds.map(seed => knex('projects').insert(seed)));
    });
};
