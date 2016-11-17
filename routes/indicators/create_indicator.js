const Boom = require('boom');

const db = require('../../db');

module.exports = [
  {
    /* Create a new indicator */
    method: 'POST',
    path: '/indicators',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const data = req.payload;
      const owner = req.auth.credentials.sub;
      const roles = req.auth.credentials.roles;
      const name = data && data.name;

      if (roles.indexOf('edit') === -1) {
        return res(Boom.unauthorized('Not authorized to perform this action'));
      }

      if (!owner || !data || !name) {
        return res(Boom.badData('Bad data'));
      }

      return db('indicators')
        .returning('id')
        .insert({
          data: data,
          owner: owner,
          name: name,
          private: data.private || false,
          published: data.published || false,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        }).then(function (ret) {
          return res({id: ret[0]});
        })
        .catch(function (err) {
          if (err.code === '23505') {
            return res(Boom.badData('Indicator name already exists'))
          }
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not add data'));
        });
    }
  }
];
