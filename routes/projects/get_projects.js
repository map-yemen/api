const db = require('../../db');

module.exports = [
  {
    /* Get all projects */
    method: 'GET',
    path: '/projects',
    config: {
      auth: {
        mode: 'optional'
      }
    },
    handler: function (req, res) {
      const roles = req.auth.credentials && req.auth.credentials.roles || [];
      const query = db('projects')
        .select('id', 'name', 'created_at', 'updated_at',
          db.raw('data->\'category\' as categories'),
          db.raw('data->\'location\' as location'));

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
