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
          db.raw('data->\'budget\' as budget'),
          db.raw('data->\'planned_start_date\' as planned_start_date'),
          db.raw('data->\'actual_start_date\' as actual_start_date'),
          db.raw('data->\'planned_end_date\' as planned_end_date'),
          db.raw('data->\'actual_end_date\' as actual_end_date'),
          db.raw('data->\'sds_indicator\' as sds_indicators'),
          db.raw('data->\'description\' as description'),
          db.raw('data->\'description_ar\' as description_ar'),
          db.raw('data->\'number_served\' as number_served'),
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
