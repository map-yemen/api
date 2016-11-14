
exports.seed = function (knex, Promise) {
  return knex('indicators').del()
    .then(function () {
      return Promise.all([
        knex('indicators').insert({id: '01ca50c2-0d69-4bd3-90b6-979ad38b1ee7', name: 'public and published', private: false, published: true, owner: 'seed', data: {}}),
        knex('indicators').insert({id: 'b96f6594-3130-4e8c-a397-ff4d50ea59f6', name: 'private and published', private: true, published: true, owner: 'seed', data: {}}),
        knex('indicators').insert({id: 'd4e25be1-fa29-483c-a5d5-43de00cca274', name: 'public and draft', private: false, published: false, owner: 'seed', data: {}}),
        knex('indicators').insert({id: 'e65d13b0-0e8c-43da-91ad-5676e02fe77d', name: 'private and draft', private: true, published: false, owner: 'seed', data: {}})
      ]);
    });
};
