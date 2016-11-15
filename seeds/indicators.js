const seeds = require('../test/fixtures/seed_data');

exports.seed = function (knex, Promise) {
  return knex('indicators').del()
    .then(function () {
      return Promise.all(seeds.map(seed => knex('indicators').insert(seed)));
    });
};
