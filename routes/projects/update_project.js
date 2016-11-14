const Boom = require('boom');

const db = require('../../db');

module.exports = [
  {
  /* Update a single project */
    method: 'PUT',
    path: '/projects/{id}',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const data = req.payload;
      const roles = req.auth.credentials.roles;

      if (roles.indexOf('edit') === -1) {
        return res(Boom.unauthorized('Not authorized to perform this action'));
      }

      return db('projects')
        .where('id', req.params.id)
        .returning('id')
        .update({
          name: data.name,
          private: data.private || false,
          published: data.published || false,
          updated_at: db.fn.now(),
          data: data
        })
        .then((ret) => res({id: ret[0]}))
        .catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not update data'));
        });
    }
  }
];
