const Boom = require('boom');

const db = require('../../db');

module.exports = [
  {
    /* Get a single indicator */
    method: 'GET',
    path: '/indicators/{id}',
    config: {
      auth: {
        mode: 'optional'
      }
    },
    handler: function (req, res) {
      return db('indicators')
        .select()
        .where('id', req.params.id)
        .then(ret => {
          const roles = req.auth.credentials && req.auth.credentials.roles || [];
          if (roles.indexOf('edit') > -1 || // edit access can see everything
             (!ret[0].private && ret[0].published) || // public and published
             (req.auth.isAuthenticated && ret[0].private && ret[0].published) // also show authorized, private, published
           ) {
            return res(ret[0]);
          } else {
            return res(Boom.unauthorized('Not authorized to perform this action'));
          }
        })
        .catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not find data'));
        });
    }
  }
];
