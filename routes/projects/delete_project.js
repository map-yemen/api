const Boom = require('boom');

const db = require('../../db');

module.exports = [
  {
    /* Delete a single project */
    method: 'DELETE',
    path: '/projects/{id}',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const roles = req.auth.credentials.roles || [];

      if (roles.indexOf('edit') === -1) {
        return res(Boom.unauthorized('Not authorized to perform this action'));
      }

      return db('projects')
        .where('id', req.params.id)
        .del()
        .then((ret) => {
          if (ret === 0) {
            return res(Boom.notFound('Could not find the requested project'));
          }
          return res({id: req.params.id});
        }).catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not delete data'));
        });
    }
  }
];
