var path = require('path');
// Update with your config settings.
module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/map_egypt_test',
    migrations: {
      tableName: 'migrations'
    },
    seeds: {
      directory: path.join(__dirname, '/seeds')
    }
  },
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'migrations'
    }
  }
};
