
exports.seed = function (knex, Promise) {
  return knex('indicators').del()
    .then(function () {
      return Promise.all([
        knex('indicators').insert({name: 'public and published', private: false, published: true, owner: 'seed', data: {}}),
        knex('indicators').insert({name: 'private and published', private: true, published: true, owner: 'seed', data: {}}),
        knex('indicators').insert({name: 'public and draft', private: false, published: false, owner: 'seed', data: {}}),
        knex('indicators').insert({name: 'private and draft', private: true, published: false, owner: 'seed', data: {}})
      ]);
    });
};
