const Boom = require('boom');

const db = require('../../db');

module.exports = [
  {
  /* Get a single project */
    method: 'GET',
    path: '/projects/{id}',
    config: {
      auth: {
        mode: 'optional'
      }
    },
    handler: function (req, res) {
      return db('projects')
        .select()
        .where('id', req.params.id)
        .then(ret => {
          if (ret.length === 0) {
            return res(Boom.notFound('Could not find the requested project'));
          }

          const roles = req.auth.credentials && req.auth.credentials.roles || [];
          if (roles.indexOf('edit') > -1 || // edit access can see everything
             (!ret[0].private && ret[0].published) || // public and published
             (req.auth.isAuthenticated && ret[0].private && ret[0].published) // also show authorized, private, published
           ) {
            const response = ret[0];
            // secondary authentication check for removing disbursement data for non-logged in users
            if (!req.auth.isAuthenticated && response.data) {
              delete response.data.disbursed;
            }
            return res(response);
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
