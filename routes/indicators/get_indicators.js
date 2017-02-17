const db = require('../../db');

module.exports = [
  {
  /* Get all indicators */
    method: 'GET',
    path: '/indicators',
    config: {
      auth: {
        mode: 'optional'
      }
    },
    handler: function (req, res) {
      const roles = req.auth.credentials && req.auth.credentials.roles || [];
      const query = db('indicators')
        .select('id', 'name', 'created_at', 'updated_at',
          db.raw('data->\'themes\' as theme'),
          db.raw('data->\'category\' as type'),
          db.raw('data->\'description\' as description'),
          db.raw('data->\'sources\' as sources')
        );

      if (!req.auth.isAuthenticated) {
        return query.where('private', false).where('published', true).then(res);
      } else if (roles.indexOf('edit') === -1) {
        return query.where('published', true).select('private').then(res);
      } else {
        return query.select('private', 'published').then(res);
      }
    }
  }
];
